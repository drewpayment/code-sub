import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const passwordConfirm = data.get('password-confirm') as string;
        const name = data.get('name') as string;

        if (!email || !password || !passwordConfirm || !name) {
            throw error(400, 'All fields are required.');
        }

        if (password !== passwordConfirm) {
            throw error(400, 'Passwords do not match.');
        }

        try {
            await locals.pb.collection('users').create({ name, email, password, passwordConfirm });
            await locals.pb.collection('users').requestVerification(email);
        } catch (err: any) {
            console.error('Register Action Error:', err);
            // This is a bit of a guess, but Pocketbase often throws a 400 for duplicate emails.
            if (err.status === 400) {
                 throw error(400, 'An account with this email address already exists.');
            }
            throw error(500, 'Something went wrong creating your account.');
        }

        throw redirect(303, '/login?registered=true');
    }
}; 