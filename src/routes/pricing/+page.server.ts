import type { PageServerLoad } from './$types';
import { SubscriptionService } from '$lib/pocketbase';

export const load: PageServerLoad = async () => {
	try {
		// Fetch all active plans
		const allPlans = await SubscriptionService.getPlans(true);
		
		// Separate plans by type
		const subscriptionPlans = allPlans.filter(plan => plan.type === 'subscription');
		const oneTimeProjects = allPlans.filter(plan => plan.type === 'one_time_project');
		
		return {
			subscriptionPlans,
			oneTimeProjects
		};
	} catch (error) {
		console.error('Error loading pricing plans:', error);
		return {
			subscriptionPlans: [],
			oneTimeProjects: []
		};
	}
}; 