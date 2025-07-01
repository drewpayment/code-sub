import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { SubscriptionService } from '$lib/pocketbase';
import { createOrGetStripeCustomer, createCheckoutSession, getRecentBillingHistoryWithRefunds, cancelStripeSubscriptionImmediately, cancelStripeSubscriptionAtPeriodEnd } from '$lib/server/stripe';
import type Stripe from 'stripe';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.pb.authStore.isValid) {
        throw redirect(303, '/login');
    }

    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // Load active plans and user's current subscription
    const [plans, currentSubscription] = await Promise.all([
        SubscriptionService.getPlans(true), // Only active plans
        SubscriptionService.getUserSubscription(locals.user.id)
    ]);

    // Fetch billing history with real-time refund status if user has a Stripe customer ID
    let billingHistory: Array<{
        id: string;
        status: string;
        displayStatus: string;
        amount_paid: number;
        amount_remaining: number;
        date: string;
        description?: string;
    }> = [];
    if (locals.user.stripe_customer_id) {
        try {
            billingHistory = await getRecentBillingHistoryWithRefunds(locals.user.stripe_customer_id);
        } catch (error) {
            console.error('Failed to fetch billing history:', error);
            // Don't fail the page load if billing history fails
        }
    }

    return {
        user: locals.user,
        plans,
        currentSubscription,
        billingHistory
    };
};

export const actions: Actions = {
    subscribe: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const data = await request.formData();
        const planId = data.get('plan_id') as string;

        if (!planId) {
            return fail(400, { error: 'Plan ID is required' });
        }

        try {
            // Check if user already has an active subscription
            const existingSubscription = await SubscriptionService.getUserSubscription(locals.user.id);
            
            if (existingSubscription && existingSubscription.status === 'active') {
                return fail(400, { error: 'You already have an active subscription. Please cancel it first before subscribing to a new plan.' });
            }

            // Create new subscription with pending_payment_setup status
            await SubscriptionService.createSubscription({
                customer_id: locals.user.id,
                plan_id: planId,
                status: 'pending',
                start_date: new Date().toISOString()
            });

            return { success: true, message: 'Successfully subscribed to plan! Please complete your payment setup.' };
        } catch (error) {
            console.error('Subscription error:', error);
            return fail(500, { error: 'Failed to create subscription. Please try again.' });
        }
    },

    createCheckoutSession: async ({ locals, url }) => {
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        // Get user's current subscription
        const subscription = await SubscriptionService.getUserSubscription(locals.user.id);
        
        if (!subscription) {
            return fail(400, { error: 'No subscription found. Please subscribe to a plan first.' });
        }

        if (subscription.status !== 'pending') {
            return fail(400, { error: 'Subscription is not in a state that requires payment setup.' });
        }

        // Get the plan details to get the Stripe price ID
        const plan = subscription.expand?.plan_id;
        
        if (!plan) {
            return fail(400, { error: 'Plan not found for this subscription.' });
        }
        
        if (!plan.stripe_price_id) {
            return fail(400, { error: `Plan "${plan.name}" does not have a Stripe price ID configured. Please contact support to configure Stripe pricing for this plan.` });
        }
        
        // Create or get Stripe customer
        const stripeCustomerId = await createOrGetStripeCustomer({
            id: locals.user.id,
            email: locals.user.email,
            name: locals.user.name,
            stripe_customer_id: locals.user.stripe_customer_id
        });

        // Update user with Stripe customer ID if it was just created
        if (!locals.user.stripe_customer_id) {
            await locals.pb.collection('users').update(locals.user.id, {
                stripe_customer_id: stripeCustomerId
            });
        }

        // Create Stripe checkout session
        const session = await createCheckoutSession({
            customer_id: stripeCustomerId,
            price_id: plan.stripe_price_id,
            success_url: `${url.origin}/stripe/success`,
            cancel_url: `${url.origin}/account/subscription?cancelled=true`,
            subscription_id: subscription.id
        });



        // Redirect to Stripe checkout
        return redirect(303, session.url!);
    },

    changePlan: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const data = await request.formData();
        const planId = data.get('plan_id') as string;

        if (!planId) {
            return fail(400, { error: 'Plan ID is required' });
        }

        try {
            const currentSubscription = await SubscriptionService.getUserSubscription(locals.user.id);
            
            if (!currentSubscription) {
                return fail(400, { error: 'No active subscription found' });
            }

            if (currentSubscription.status !== 'active') {
                return fail(400, { error: 'Can only change plans for active subscriptions' });
            }

            // Get the new plan details
            const newPlan = await SubscriptionService.getPlan(planId);
            if (!newPlan) {
                return fail(400, { error: 'New plan not found' });
            }

            if (!newPlan.stripe_price_id) {
                return fail(400, { error: 'New plan does not have Stripe pricing configured' });
            }

            // Step 1: Cancel the current Stripe subscription if it exists
            if (currentSubscription.stripe_subscription_id) {
                try {
                    await cancelStripeSubscriptionImmediately(currentSubscription.stripe_subscription_id);
                } catch (error) {
                    console.error('Failed to cancel Stripe subscription:', error);
                    // Continue anyway - the subscription might already be cancelled
                }
            }

            // Step 2: Update the local subscription to the new plan with pending status
            await SubscriptionService.updateSubscription(currentSubscription.id, {
                plan_id: planId,
                status: 'pending',
                stripe_subscription_id: undefined, // Clear the old Stripe subscription ID
                notes: `Plan changed from ${currentSubscription.expand?.plan_id?.name} to ${newPlan.name} on ${new Date().toLocaleDateString()}. Requires payment setup.`
            });

            return { 
                success: true, 
                message: 'Plan changed successfully! Your previous subscription has been cancelled. Please complete payment setup for your new plan.' 
            };
        } catch (error) {
            console.error('Plan change error:', error);
            return fail(500, { error: 'Failed to change plan. Please try again.' });
        }
    },

            cancelSubscription: async ({ locals }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        try {
            // Get current subscription
            const currentSubscription = await SubscriptionService.getUserSubscription(locals.user.id);
            if (!currentSubscription) {
                return fail(400, { error: 'No active subscription found' });
            }

            // Cancel Stripe subscription at period end if it exists
            let subscriptionEndDate = null;
            if (currentSubscription.stripe_subscription_id) {
                try {
                    const stripeSubscription: Stripe.Subscription = await cancelStripeSubscriptionAtPeriodEnd(currentSubscription.stripe_subscription_id);
                    // Convert Stripe timestamp to ISO string
                    subscriptionEndDate = new Date(stripeSubscription.current_period_end * 1000).toISOString();
                } catch (error) {
                    console.error('Error cancelling Stripe subscription:', error);
                    return fail(500, { error: 'Failed to cancel payment subscription' });
                }
            }

            // Update subscription status to cancelled and set end date
            await SubscriptionService.updateSubscription(currentSubscription.id, {
                status: 'cancelled',
                end_date: subscriptionEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Fallback to 30 days from now
            });


            return { success: true, message: 'Subscription cancelled successfully. You will retain access until the end of your current billing period.' };

        } catch (error) {
            console.error('Error cancelling subscription:', error);
            return fail(500, { error: 'Failed to cancel subscription' });
        }
    }
}; 