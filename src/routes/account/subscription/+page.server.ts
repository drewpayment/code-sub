import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { SubscriptionService } from '$lib/pocketbase';

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

            // Create new subscription
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