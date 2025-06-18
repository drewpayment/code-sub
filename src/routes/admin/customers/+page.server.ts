import type { PageServerLoad, Actions } from './$types';
import { SubscriptionService } from '$lib/pocketbase';
import { fail, redirect } from '@sveltejs/kit';
import type { UserRole } from '$lib/types/subscription';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const page = Number.parseInt(url.searchParams.get('page') || '1');
		const search = url.searchParams.get('search') || '';
		const perPage = 20;

		// Build filter for search
		let filter = '';
		if (search) {
			filter = `name ~ "${search}" || email ~ "${search}"`;
		}

		// Fetch customers with pagination
		const customers = await SubscriptionService.getCustomers({
			page,
			perPage,
			filter
		});

		// Debug logging
		console.log('Customers query result:', {
			totalItems: customers.totalItems,
			itemsLength: customers.items.length,
			filter: filter || 'role = customer'
		});

		// Get stats for display
		const stats = await SubscriptionService.getDashboardStats();

		return {
			customers: customers.items,
			pagination: {
				page: customers.page,
				perPage: customers.perPage,
				totalItems: customers.totalItems,
				totalPages: customers.totalPages
			},
			search,
			stats
		};
	} catch (error) {
		console.error('Error loading customers:', error);
		return {
			customers: [],
			pagination: {
				page: 1,
				perPage: 20,
				totalItems: 0,
				totalPages: 0
			},
			search: '',
			stats: {
				total_customers: 0,
				active_subscriptions: 0,
				pending_subscriptions: 0,
				monthly_revenue: 0,
				new_customers_this_month: 0
			}
		};
	}
};

export const actions: Actions = {
	createCustomer: async ({ request }) => {
		try {
			const formData = await request.formData();
			const email = formData.get('email')?.toString();
			const name = formData.get('name')?.toString();
			const role = formData.get('role')?.toString() || 'customer';

			if (!email) {
				return fail(400, { error: 'Email is required' });
			}

			// Basic email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return fail(400, { error: 'Please enter a valid email address' });
			}

			// Create customer with a temporary password (they'll need to reset it)
			const customerData = {
				email,
				name: name || '',
				role: role as UserRole,
				password: 'TempPassword123!', // User will need to reset this
				passwordConfirm: 'TempPassword123!'
			};

			console.log('Creating customer with data:', customerData);
			const result = await SubscriptionService.createCustomer(customerData);
			console.log('Customer created successfully:', result.id, result.email, result.role);

			// Redirect to refresh the page data and show the new customer
			throw redirect(303, '/admin/customers');

		} catch (error: unknown) {
			console.error('Error creating customer:', error);
			
			// Handle specific PocketBase errors
			if (error && typeof error === 'object' && 'data' in error && 
				error.data && typeof error.data === 'object' && 'email' in error.data) {
				return fail(400, { error: 'Email address is already in use' });
			}
			
			return fail(500, { error: 'Failed to create customer. Please try again.' });
		}
	}
}; 