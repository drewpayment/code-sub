import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SubscriptionService } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.pb.authStore.isValid) {
        throw redirect(303, '/login');
    }

    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // Load user's subscription data
    const subscription = await SubscriptionService.getUserSubscription(locals.user.id);

    return {
        user: locals.user,
        subscription
    };
}; 