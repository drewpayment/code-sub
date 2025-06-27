import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { SubscriptionService } from '$lib/pocketbase';
import { createOrGetStripeCustomer, createCheckoutSession } from '$lib/server/stripe';

export const load: PageServerLoad = async ({ locals, url }) => {
    // Debug logging for Stripe return
    if (url.searchParams.has('success')) {
        console.log('User returned from Stripe checkout - SUCCESS');
        console.log('Auth status:', locals.pb.authStore.isValid);
        console.log('User:', locals.user?.email);
    }
    if (url.searchParams.has('cancelled')) {
        console.log('User returned from Stripe checkout - CANCELLED');
    }

    if (!locals.pb.authStore.isValid) {
        console.log('Auth store invalid, redirecting to login');
        throw redirect(303, '/login');
    }

    if (!locals.user) {
        console.log('No user in locals, redirecting to login');
        throw redirect(303, '/login');
    }

    // Load active plans and user's current subscription
    const [plans, currentSubscription] = await Promise.all([
        SubscriptionService.getPlans(true), // Only active plans
        SubscriptionService.getUserSubscription(locals.user.id)
    ]);

    if (url.searchParams.has('success') && currentSubscription) {
        console.log('Current subscription status after Stripe:', currentSubscription.status);
    }

    return {
        user: locals.user,
        plans,
        currentSubscription
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
        
        console.log('=== CREATE CHECKOUT SESSION DEBUG ===');
        console.log('User ID:', locals.user.id);
        console.log('Found subscription:', subscription ? {
            id: subscription.id,
            status: subscription.status,
            customer_id: subscription.customer_id,
            plan_id: subscription.plan_id
        } : 'null');
        
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
        
        console.log('Creating checkout session with subscription ID:', subscription.id);
        
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

        console.log('Created Stripe session with metadata:', {
            subscription_id: subscription.id,
            session_id: session.id
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

            // Update subscription to new plan
            await SubscriptionService.updateSubscription(currentSubscription.id, {
                plan_id: planId,
                status: 'pending', // May need payment setup for new plan
                notes: `Plan changed from ${currentSubscription.expand?.plan_id?.name} on ${new Date().toLocaleDateString()}`
            });

            return { success: true, message: 'Plan changed successfully! Please update your payment details if needed.' };
        } catch (error) {
            console.error('Plan change error:', error);
            return fail(500, { error: 'Failed to change plan. Please try again.' });
        }
    },

    cancelSubscription: async ({ locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        try {
            const currentSubscription = await SubscriptionService.getUserSubscription(locals.user.id);
            
            if (!currentSubscription) {
                return fail(400, { error: 'No active subscription found' });
            }

            // Update subscription status to cancelled
            await SubscriptionService.updateSubscription(currentSubscription.id, {
                status: 'cancelled',
                end_date: new Date().toISOString(),
                notes: `Subscription cancelled by customer on ${new Date().toLocaleDateString()}`
            });

            return { success: true, message: 'Subscription cancelled successfully.' };
        } catch (error) {
            console.error('Cancellation error:', error);
            return fail(500, { error: 'Failed to cancel subscription. Please try again.' });
        }
    }
}; 