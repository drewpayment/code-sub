import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    console.log('Stripe success page accessed');
    console.log('Auth status:', locals.pb.authStore.isValid);
    console.log('User:', locals.user?.email);
    
    // If user is not authenticated, redirect to login with a success parameter
    if (!locals.pb.authStore.isValid || !locals.user) {
        console.log('User not authenticated on success page, redirecting to login with success flag');
        throw redirect(303, '/login?stripe_success=true');
    }

    // If authenticated, redirect to the subscription page with success
    throw redirect(303, '/account/subscription?success=true');
}; 