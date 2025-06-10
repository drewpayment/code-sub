import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email || !password) {
            throw error(400, 'Email and password are required.');
        }

        try {
            await locals.pb.collection('users').authWithPassword(email, password);
        } catch (err: any) {
            console.error('Login Action Error:', err);
            throw error(401, 'Invalid email or password.');
        }

        throw redirect(303, '/');
    }
}; 