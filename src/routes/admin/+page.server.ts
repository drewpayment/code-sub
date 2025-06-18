import type { PageServerLoad } from './$types';
import { SubscriptionService } from '$lib/pocketbase';

export const load: PageServerLoad = async () => {
	try {
		// Fetch dashboard statistics
		const stats = await SubscriptionService.getDashboardStats();
		
		// Fetch recent subscriptions for activity feed
		const recentSubscriptions = await SubscriptionService.getSubscriptions({
			page: 1,
			perPage: 5,
			expand: 'customer_id,plan_id'
		});

		return {
			stats,
			recentSubscriptions: recentSubscriptions.items
		};
	} catch (error) {
		console.error('Error loading dashboard data:', error);
		return {
			stats: {
				total_customers: 0,
				active_subscriptions: 0,
				pending_subscriptions: 0,
				monthly_revenue: 0,
				new_customers_this_month: 0
			},
			recentSubscriptions: []
		};
	}
}; 