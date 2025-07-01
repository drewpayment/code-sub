import type { PageServerLoad } from './$types';
import { SubscriptionService } from '$lib/pocketbase';
import { getStripeDashboardMetrics } from '$lib/server/stripe';

export const load: PageServerLoad = async () => {
	try {
		// Fetch dashboard statistics from PocketBase
		const pocketbaseStats = await SubscriptionService.getDashboardStats();
		
		// Fetch recent subscriptions for activity feed
		const recentSubscriptions = await SubscriptionService.getSubscriptions({
			page: 1,
			perPage: 5,
			expand: 'customer_id,plan_id'
		});

		// Fetch Stripe dashboard metrics
		let stripeMetrics: {
			active_subscriptions: number;
			past_due_subscriptions: number;
			cancelled_subscriptions: number;
			total_customers: number;
			mrr: number;
			failed_payments_this_month: number;
		};
		try {
			stripeMetrics = await getStripeDashboardMetrics();
		} catch (error) {
			console.error('Failed to fetch Stripe metrics:', error);
			// Fallback to zero values if Stripe is unavailable
			stripeMetrics = {
				active_subscriptions: 0,
				past_due_subscriptions: 0,
				cancelled_subscriptions: 0,
				total_customers: 0,
				mrr: 0,
				failed_payments_this_month: 0
			};
		}

		// Merge stats from both sources, preferring Stripe data where available
		const stats = {
			// Customer and subscription counts - use PocketBase as source of truth for now
			total_customers: pocketbaseStats.total_customers,
			active_subscriptions: pocketbaseStats.active_subscriptions,
			pending_subscriptions: pocketbaseStats.pending_subscriptions,
			monthly_revenue: pocketbaseStats.monthly_revenue,
			new_customers_this_month: pocketbaseStats.new_customers_this_month,
			
			// Stripe-specific metrics
			stripe_active_subscriptions: stripeMetrics.active_subscriptions,
			past_due_subscriptions: stripeMetrics.past_due_subscriptions,
			cancelled_subscriptions: stripeMetrics.cancelled_subscriptions,
			stripe_total_customers: stripeMetrics.total_customers,
			stripe_mrr: stripeMetrics.mrr,
			failed_payments_this_month: stripeMetrics.failed_payments_this_month
		};

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
				new_customers_this_month: 0,
				stripe_active_subscriptions: 0,
				past_due_subscriptions: 0,
				cancelled_subscriptions: 0,
				stripe_total_customers: 0,
				stripe_mrr: 0,
				failed_payments_this_month: 0
			},
			recentSubscriptions: []
		};
	}
}; 