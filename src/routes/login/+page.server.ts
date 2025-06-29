import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const stripeSuccess = url.searchParams.has('stripe_success');
    return {
        stripeSuccess
    };
};

export const actions: Actions = {
    default: async ({ locals, request, url }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const stripeSuccess = url.searchParams.has('stripe_success');

        if (!email || !password) {
            throw error(400, 'Email and password are required.');
        }

        try {
            await locals.pb.collection('users').authWithPassword(email, password);
        } catch (err) {
            console.error('Login Action Error:', err);
            throw error(401, 'Invalid email or password.');
        }

        // If user came from Stripe success, redirect back to subscription page
        if (stripeSuccess) {
            throw redirect(303, '/account/subscription?success=true');
        }

        throw redirect(303, '/');
    }
}; 