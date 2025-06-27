import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRecentBillingHistory } from '$lib/server/stripe';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	if (!locals.user.stripe_customer_id) {
		return json({ invoices: [] }); // No billing history if no Stripe customer
	}

	try {
		const invoices = await getRecentBillingHistory(locals.user.stripe_customer_id);
		
		// Transform invoices to a simpler format for the frontend
		const simplifiedInvoices = invoices.map(invoice => ({
			id: invoice.id,
			amount_paid: invoice.amount_paid,
			currency: invoice.currency,
			status: invoice.status,
			created: invoice.created,
			invoice_pdf: invoice.invoice_pdf,
			hosted_invoice_url: invoice.hosted_invoice_url,
			period_start: invoice.period_start,
			period_end: invoice.period_end,
			description: invoice.lines?.data?.[0]?.description || 'Subscription payment'
		}));

		return json({ invoices: simplifiedInvoices });
	} catch (error) {
		console.error('Failed to fetch billing history:', error);
		return json({ error: 'Failed to fetch billing history' }, { status: 500 });
	}
}; 