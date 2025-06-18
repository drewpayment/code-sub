import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types/subscription';
import { hasAdminAccess } from '$lib';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const user = locals.user as User | null;

	// Check if user is authenticated
	if (!user) {
		throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	// Check if user has admin role
	if (!hasAdminAccess(user.role)) {
		throw redirect(302, '/account?error=insufficient_permissions');
	}

	// Return user data for the admin layout
	return {
		user: user
	};
}; 