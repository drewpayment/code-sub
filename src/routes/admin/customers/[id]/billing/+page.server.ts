import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCustomerBillingHistory } from '$lib/server/stripe';
import { hasAdminAccess } from '$lib/types/subscription';
import { pb } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// Check admin access
	if (!hasAdminAccess(locals.user.role)) {
		throw error(403, 'Access denied. Admin privileges required.');
	}

	const customerId = params.id;
	if (!customerId) {
		throw error(400, 'Customer ID is required');
	}

	try {
		// Get customer details
		const customer = await pb.collection('users').getOne(customerId);
		
		// Get customer's subscription
		const subscriptions = await pb.collection('subscriptions').getList(1, 1, {
			filter: `customer_id = "${customerId}"`,
			expand: 'plan_id',
		});

		let billingHistory: any[] = [];
		
		// Fetch billing history from Stripe if customer has a Stripe customer ID
		if (customer.stripe_customer_id) {
			try {
				const invoices = await getCustomerBillingHistory(customer.stripe_customer_id, 100);
				
				// Transform invoices for display
				billingHistory = invoices.map(invoice => ({
					id: invoice.id,
					amount_paid: invoice.amount_paid,
					amount_due: invoice.amount_due,
					currency: invoice.currency,
					status: invoice.status,
					created: invoice.created,
					invoice_pdf: invoice.invoice_pdf,
					hosted_invoice_url: invoice.hosted_invoice_url,
					period_start: invoice.period_start,
					period_end: invoice.period_end,
					description: invoice.lines?.data?.[0]?.description || 'Subscription payment'
				}));
			} catch (stripeError) {
				console.error('Failed to fetch Stripe billing history:', stripeError);
				// Continue without billing history rather than failing the whole page
			}
		}

		return {
			customer,
			subscription: subscriptions.items[0] || null,
			billingHistory
		};
	} catch (err) {
		console.error('Failed to load customer billing data:', err);
		throw error(500, 'Failed to load customer billing information');
	}
}; 