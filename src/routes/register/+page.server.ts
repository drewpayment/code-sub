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
            await locals.pb.collection('users').create({ 
                name, 
                email, 
                password, 
                passwordConfirm,
                role: 'customer', // Required field - default new users to customer role
                emailVisibility: true // Allow email to be visible to admin users
            });
            await locals.pb.collection('users').requestVerification(email);
        } catch (err: unknown) {
            console.error('Register Action Error:', err);
            
            // Handle PocketBase ClientResponseError
            if (err && typeof err === 'object' && 'status' in err) {
                const pbError = err as { status: number; message?: string; data?: Record<string, unknown> };
                
                if (pbError.status === 400) {
                    // Check if it's a duplicate email error
                    if (pbError.data?.email) {
                        throw error(400, 'An account with this email address already exists.');
                    }
                    // Handle other validation errors
                    throw error(400, 'Please check your input and try again.');
                }
            }
            
            throw error(500, 'Something went wrong creating your account.');
        }

        throw redirect(303, '/login?registered=true');
    }
}; 