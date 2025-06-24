import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { SubscriptionService } from '$lib/pocketbase';
import type { BillingPeriod } from '$lib/types/subscription';

export const load: PageServerLoad = async () => {
	try {
		// Fetch all plans (active and inactive)
		const plans = await SubscriptionService.getPlans(false);
		
		return {
			plans
		};
	} catch (error) {
		console.error('Error loading plans:', error);
		return {
			plans: []
		};
	}
};

export const actions: Actions = {
	createPlan: async ({ request }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name') as string;
			const description = formData.get('description') as string;
			const price = Number.parseFloat(formData.get('price') as string);
			const billing_period = formData.get('billing_period') as BillingPeriod;
			const is_active = formData.get('is_active') === 'on';
			
			// Parse features if provided
			const featuresText = formData.get('features') as string;
			let features = {};
			if (featuresText) {
				try {
					features = JSON.parse(featuresText);
				} catch {
					features = { description: featuresText };
				}
			}

			if (!name || Number.isNaN(price) || !billing_period) {
				return fail(400, { 
					error: 'Name, price, and billing period are required' 
				});
			}

			const plan = await SubscriptionService.createPlan({
				name,
				description,
				price,
				billing_period,
				features,
				is_active
			});

			return {
				success: true,
				message: 'Plan created successfully',
				plan
			};
		} catch (err) {
			console.error('Error creating plan:', err);
			return fail(500, { 
				error: 'Failed to create plan. Please try again.' 
			});
		}
	},

	updatePlan: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id') as string;
			const name = formData.get('name') as string;
			const description = formData.get('description') as string;
			const price = Number.parseFloat(formData.get('price') as string);
			const billing_period = formData.get('billing_period') as BillingPeriod;
			const is_active = formData.get('is_active') === 'on';
			
			// Parse features if provided
			const featuresText = formData.get('features') as string;
			let features = {};
			if (featuresText) {
				try {
					features = JSON.parse(featuresText);
				} catch {
					features = { description: featuresText };
				}
			}

			if (!id || !name || Number.isNaN(price) || !billing_period) {
				return fail(400, { 
					error: 'ID, name, price, and billing period are required' 
				});
			}

			const plan = await SubscriptionService.updatePlan(id, {
				name,
				description,
				price,
				billing_period,
				features,
				is_active
			});

			return {
				success: true,
				message: 'Plan updated successfully',
				plan
			};
		} catch (err) {
			console.error('Error updating plan:', err);
			return fail(500, { 
				error: 'Failed to update plan. Please try again.' 
			});
		}
	},

	togglePlanStatus: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id') as string;
			const is_active = formData.get('is_active') === 'true';

			if (!id) {
				return fail(400, { error: 'Plan ID is required' });
			}

			const plan = await SubscriptionService.updatePlan(id, {
				is_active: !is_active
			});

			return {
				success: true,
				message: `Plan ${is_active ? 'deactivated' : 'activated'} successfully`,
				plan
			};
		} catch (err) {
			console.error('Error toggling plan status:', err);
			return fail(500, { 
				error: 'Failed to update plan status. Please try again.' 
			});
		}
	}
}; 