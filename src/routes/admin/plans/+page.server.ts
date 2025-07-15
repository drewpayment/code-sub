import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { SubscriptionService } from '$lib/pocketbase';
import type { BillingPeriod, PlanType } from '$lib/types/subscription';
import type { CreatePlanData } from '$lib/types/subscription';
import type { Plan } from '$lib/types/subscription';

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
			const type = formData.get('type') as PlanType;
			const is_active = formData.get('is_active') === 'on';
			
			if (!name || !type) {
				return fail(400, { 
					error: 'Name and plan type are required' 
				});
			}

			// Handle plan data based on type
			const planData = {
				name,
				description,
				type,
				is_active
			} as CreatePlanData;

			if (type === 'subscription') {
				const price = Number.parseFloat(formData.get('price') as string);
				const billing_period = formData.get('billing_period') as BillingPeriod;
				
				if (Number.isNaN(price) || !billing_period) {
					return fail(400, { 
						error: 'Price and billing period are required for subscription plans' 
					});
				}
				
				planData.price = price;
				planData.billing_period = billing_period;
				
				// Parse features for subscriptions (JSON format)
				const featuresText = formData.get('features') as string;
				if (featuresText) {
					try {
						planData.features = JSON.parse(featuresText);
					} catch {
						planData.features = { description: featuresText };
					}
				}
			} else if (type === 'one_time_project') {
				const price_min = Number.parseFloat(formData.get('price_min') as string);
				const price_max = Number.parseFloat(formData.get('price_max') as string);
				
				if (Number.isNaN(price_min) || Number.isNaN(price_max)) {
					return fail(400, { 
						error: 'Price range (min and max) is required for one-time projects' 
					});
				}
				
				if (price_min >= price_max) {
					return fail(400, { 
						error: 'Minimum price must be less than maximum price' 
					});
				}
				
				planData.price_min = price_min;
				planData.price_max = price_max;
				
				// Parse features for one-time projects (array format)
				const featuresText = formData.get('features') as string;
				if (featuresText) {
					try {
						// Try parsing as JSON array first
						planData.features = JSON.parse(featuresText);
					} catch {
						// If not valid JSON, split by newlines/commas
						planData.features = featuresText.split(/\n|,/).map(f => f.trim()).filter(f => f);
					}
				}
			}

			const plan = await SubscriptionService.createPlan(planData);

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
			const type = formData.get('type') as PlanType;
			const is_active = formData.get('is_active') === 'on';

			if (!id || !name || !type) {
				return fail(400, { 
					error: 'ID, name, and plan type are required' 
				});
			}

			// Handle plan data based on type
			const planData = {
				name,
				description,
				type,
				is_active
			} as Partial<Plan>;

			if (type === 'subscription') {
				const price = Number.parseFloat(formData.get('price') as string);
				const billing_period = formData.get('billing_period') as BillingPeriod;
				
				if (Number.isNaN(price) || !billing_period) {
					return fail(400, { 
						error: 'Price and billing period are required for subscription plans' 
					});
				}
				
				planData.price = price;
				planData.billing_period = billing_period;
				
				// Clear one-time project fields
				planData.price_min = undefined;
				planData.price_max = undefined;
				
				// Parse features for subscriptions (JSON format)
				const featuresText = formData.get('features') as string;
				if (featuresText) {
					try {
						planData.features = JSON.parse(featuresText);
					} catch {
						planData.features = { description: featuresText };
					}
				}
			} else if (type === 'one_time_project') {
				const price_min = Number.parseFloat(formData.get('price_min') as string);
				const price_max = Number.parseFloat(formData.get('price_max') as string);
				
				if (Number.isNaN(price_min) || Number.isNaN(price_max)) {
					return fail(400, { 
						error: 'Price range (min and max) is required for one-time projects' 
					});
				}
				
				if (price_min >= price_max) {
					return fail(400, { 
						error: 'Minimum price must be less than maximum price' 
					});
				}
				
				planData.price_min = price_min;
				planData.price_max = price_max;
				
				// Clear subscription fields
				planData.price = undefined;
				planData.billing_period = undefined;
				
				// Parse features for one-time projects (array format)
				const featuresText = formData.get('features') as string;
				if (featuresText) {
					try {
						// Try parsing as JSON array first
						planData.features = JSON.parse(featuresText);
					} catch {
						// If not valid JSON, split by newlines/commas
						planData.features = featuresText.split(/\n|,/).map(f => f.trim()).filter(f => f);
					}
				}
			}

			const plan = await SubscriptionService.updatePlan(id, planData);

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