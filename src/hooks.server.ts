import { pb } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	
	if (pb.authStore.isValid) {
		try {
			// Refresh the auth token to extend the session
			await pb.collection('users').authRefresh();
		} catch (error) {
			console.warn('Auth refresh failed:', error);
			pb.authStore.clear();
		}
	}

	event.locals.pb = pb;
	event.locals.user = structuredClone(pb.authStore.model);

	const response = await resolve(event);

	// Set cookie with appropriate security settings
	const cookieOptions = {
		secure: !dev, // Only secure in production
		httpOnly: false, // PocketBase needs client access
		sameSite: 'lax' as const, // Allow cross-site navigation (important for Stripe redirects)
		maxAge: 7 * 24 * 60 * 60 // 7 days
	};

	response.headers.set('set-cookie', pb.authStore.exportToCookie(cookieOptions));

	return response;
};
