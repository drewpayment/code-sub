import type { PageServerLoad } from './$types';
import { SubscriptionService } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const page = Number.parseInt(url.searchParams.get('page') || '1');
		const status = url.searchParams.get('status') || '';
		const search = url.searchParams.get('search') || '';
		const perPage = 20;

		// Build filter
		let filter = '';
		if (status) {
			filter = `status = "${status}"`;
		}
		if (search) {
			const searchFilter = `customer_id.name ~ "${search}" || customer_id.email ~ "${search}" || plan_id.name ~ "${search}"`;
			filter = filter ? `(${filter}) && (${searchFilter})` : searchFilter;
		}

		// Fetch subscriptions with pagination
		const subscriptions = await SubscriptionService.getSubscriptions({
			page,
			perPage,
			filter,
			expand: 'customer_id,plan_id'
		});

		// Get stats for display
		const stats = await SubscriptionService.getDashboardStats();

		return {
			subscriptions: subscriptions.items,
			pagination: {
				page: subscriptions.page,
				perPage: subscriptions.perPage,
				totalItems: subscriptions.totalItems,
				totalPages: subscriptions.totalPages
			},
			filters: {
				status,
				search
			},
			stats
		};
	} catch (error) {
		console.error('Error loading subscriptions:', error);
		return {
			subscriptions: [],
			pagination: {
				page: 1,
				perPage: 20,
				totalItems: 0,
				totalPages: 0
			},
			filters: {
				status: '',
				search: ''
			},
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