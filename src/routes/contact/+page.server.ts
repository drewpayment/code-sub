import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { PB_URL, PB_EMAIL, PB_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

export const actions: Actions = {
	default: async ({ request }) => {
		const pb = new PocketBase(PB_URL);
		await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);

		const data = await request.formData();
		const name = data.get('name');
		const email = data.get('email');
		const phone = data.get('phone');
		const description = data.get('description');
		const source = data.get('source');
		const selected_plan = data.get('plan');

		const errors: Record<string, string[]> = {};

		if (!name || typeof name !== 'string') {
			errors.name = ['Full Name is required.'];
		}

		if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
			errors.email = ['A valid Email Address is required.'];
		}

		if (!phone || typeof phone !== 'string') {
			errors.phone = ['Phone Number is required.'];
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				data: { name, email, phone, description }
			});
		}

		try {
			await pb.collection('contact_submissions').create({
				name,
				email,
				phone,
				description,
				source,
				selected_plan
			});

			const redirectUrl = `/thank-you?source=${source || ''}${
				selected_plan ? `&plan=${selected_plan}` : ''
			}`;
			throw redirect(303, redirectUrl);
		} catch (err: unknown) {
			console.error('Error creating submission:', err);
			// Handle redirect thrown by SvelteKit
			if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
				throw err;
			}
			const message =
				err instanceof Error ? err.message : 'An unknown error occurred.';
			return fail(500, {
				error: `Failed to send message. ${message}`,
				data: { name, email, phone, description }
			});
		}
	}
};
