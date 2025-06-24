import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { SubscriptionService } from '$lib/pocketbase';
import type { SubscriptionStatus } from '$lib/types/subscription';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const customerId = params.id;
		
		// Fetch customer details
		const customer = await SubscriptionService.getUser(customerId);
		
		// Fetch all plans for assignment
		const plans = await SubscriptionService.getPlans(true); // Only active plans
		
		// Fetch customer's current subscriptions
		const subscriptions = await SubscriptionService.getSubscriptions({
			filter: `customer_id = "${customerId}"`,
			expand: 'plan_id'
		});

		return {
			customer,
			plans,
			subscriptions: subscriptions.items
		};
	} catch (err) {
		console.error('Error loading customer data:', err);
		throw error(404, 'Customer not found');
	}
};

export const actions: Actions = {
	assignPlan: async ({ request, params }) => {
		try {
			const formData = await request.formData();
			const planId = formData.get('planId') as string;
			const customerId = params.id;

			if (!planId) {
				return fail(400, { error: 'Plan ID is required' });
			}

			// Create new subscription
			const subscription = await SubscriptionService.createSubscription({
				customer_id: customerId,
				plan_id: planId,
				status: 'pending',
				start_date: new Date().toISOString().split('T')[0]
			});

			return {
				success: true,
				message: 'Subscription assigned successfully',
				subscription
			};
		} catch (err) {
			console.error('Error assigning plan:', err);
			return fail(500, { 
				error: 'Failed to assign plan. Please try again.' 
			});
		}
	},

	updateSubscription: async ({ request }) => {
		try {
			const formData = await request.formData();
			const subscriptionId = formData.get('subscriptionId') as string;
			const status = formData.get('status') as string;
			const notes = formData.get('notes') as string;

			if (!subscriptionId || !status) {
				return fail(400, { error: 'Subscription ID and status are required' });
			}

			const updateData: { status: SubscriptionStatus; notes?: string; end_date?: string } = { status: status as SubscriptionStatus };
			
			if (notes) updateData.notes = notes;
			
			// Set end date if cancelling
			if (status === 'cancelled' || status === 'suspended') {
				updateData.end_date = new Date().toISOString().split('T')[0];
			}

			const subscription = await SubscriptionService.updateSubscription(subscriptionId, updateData);

			return {
				success: true,
				message: 'Subscription updated successfully',
				subscription
			};
		} catch (err) {
			console.error('Error updating subscription:', err);
			return fail(500, { 
				error: 'Failed to update subscription. Please try again.' 
			});
		}
	},

	deleteSubscription: async ({ request }) => {
		try {
			const formData = await request.formData();
			const subscriptionId = formData.get('subscriptionId') as string;

			if (!subscriptionId) {
				return fail(400, { error: 'Subscription ID is required' });
			}

			await SubscriptionService.deleteSubscription(subscriptionId);

			return {
				success: true,
				message: 'Subscription deleted successfully'
			};
		} catch (err) {
			console.error('Error deleting subscription:', err);
			return fail(500, { 
				error: 'Failed to delete subscription. Please try again.' 
			});
		}
	}
}; 