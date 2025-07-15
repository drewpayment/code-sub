import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals }) => {
		// Clear the server-side authentication store
		locals.pb.authStore.clear();
		
		// Redirect to homepage after logout
		throw redirect(303, '/');
	}
}; 