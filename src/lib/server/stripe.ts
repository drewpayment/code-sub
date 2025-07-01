import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
	throw new Error('STRIPE_SECRET_KEY is required');
}

// Initialize Stripe client
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-05-28.basil',
	typescript: true,
});

/**
 * Create or retrieve a Stripe Customer for a user
 */
export async function createOrGetStripeCustomer(user: {
	id: string;
	email: string;
	name?: string;
	stripe_customer_id?: string;
}): Promise<string> {
	// If user already has a Stripe customer ID, return it
	if (user.stripe_customer_id) {
		try {
			// Verify the customer still exists in Stripe
			await stripe.customers.retrieve(user.stripe_customer_id);
			return user.stripe_customer_id;
		} catch {
			// Customer doesn't exist in Stripe, create a new one
			console.warn(`Stripe customer ${user.stripe_customer_id} not found, creating new one`);
		}
	}

	// Create new Stripe customer
	const customer = await stripe.customers.create({
		email: user.email,
		name: user.name || undefined,
		metadata: {
			user_id: user.id,
		},
	});

	return customer.id;
}

/**
 * Create a Stripe Checkout Session for subscription payment
 */
export async function createCheckoutSession(params: {
	customer_id: string;
	price_id: string;
	success_url: string;
	cancel_url: string;
	subscription_id: string;
}): Promise<Stripe.Checkout.Session> {
	const session = await stripe.checkout.sessions.create({
		customer: params.customer_id,
		payment_method_types: ['card'],
		mode: 'subscription',
		line_items: [
			{
				price: params.price_id,
				quantity: 1,
			},
		],
		success_url: params.success_url,
		cancel_url: params.cancel_url,
		metadata: {
			subscription_id: params.subscription_id,
		},
		subscription_data: {
			metadata: {
				subscription_id: params.subscription_id,
			},
		},
	});

	return session;
}

/**
 * Get billing history for a customer (including refunded invoices)
 */
export async function getCustomerBillingHistory(
	customer_id: string,
	limit = 100
): Promise<Stripe.Invoice[]> {
	const invoices = await stripe.invoices.list({
		customer: customer_id,
		limit,
	});

	return invoices.data;
}

/**
 * Get recent billing history for customer (last 12 months, including refunded)
 */
export async function getRecentBillingHistory(customer_id: string): Promise<Stripe.Invoice[]> {
	const twelveMonthsAgo = new Date();
	twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

	const invoices = await stripe.invoices.list({
		customer: customer_id,
		limit: 100,
		created: {
			gte: Math.floor(twelveMonthsAgo.getTime() / 1000),
		},
		expand: ['data.charge'],
	});

	return invoices.data;
}

/**
 * Get recent billing history with real-time refund status
 */
export async function getRecentBillingHistoryWithRefunds(customer_id: string): Promise<any[]> {
	const twelveMonthsAgo = new Date();
	twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

	const invoices = await stripe.invoices.list({
		customer: customer_id,
		limit: 100,
		created: {
			gte: Math.floor(twelveMonthsAgo.getTime() / 1000),
		},
	});

	// For each invoice, get the latest status from Stripe
	const invoicesWithRefundStatus = [];
	
	for (const invoice of invoices.data) {
		try {
			// Get the latest invoice data from Stripe
			const latestInvoice = await stripe.invoices.retrieve(invoice.id);
			
			// Determine display status based on current state
			let displayStatus = latestInvoice.status;
			
			// Check if invoice was voided (refunded)
			if (latestInvoice.status === 'void') {
				displayStatus = 'refunded';
			}
			// Check if invoice has partial refunds by looking at amount_remaining
			else if (latestInvoice.amount_paid > 0 && latestInvoice.amount_remaining > 0) {
				displayStatus = 'partially_refunded';
			}
			
			invoicesWithRefundStatus.push({
				...latestInvoice,
				displayStatus
			});
		} catch (error) {
			console.error(`Failed to get latest invoice data for ${invoice.id}:`, error);
			// Fallback to original invoice data
			invoicesWithRefundStatus.push({
				...invoice,
				displayStatus: invoice.status
			});
		}
	}

	return invoicesWithRefundStatus;
}

/**
 * Get detailed invoice information including refund status
 */
export async function getInvoiceWithRefunds(invoice_id: string): Promise<{
	invoice: Stripe.Invoice;
	refunds: Stripe.Refund[];
	totalRefunded: number;
	isFullyRefunded: boolean;
}> {
	const invoice = await stripe.invoices.retrieve(invoice_id, {
		expand: ['charge'],
	});

	let refunds: Stripe.Refund[] = [];
	let totalRefunded = 0;

	// Check if invoice has a charge and get refunds
	if (invoice.charge) {
		const chargeId = typeof invoice.charge === 'string' ? invoice.charge : invoice.charge.id;
		
		// Get refunds for this charge
		const refundList = await stripe.refunds.list({
			charge: chargeId,
		});
		refunds = refundList.data;
		totalRefunded = refunds.reduce((sum, refund) => sum + refund.amount, 0);
	}

	const isFullyRefunded = totalRefunded >= invoice.amount_paid;

	return {
		invoice,
		refunds,
		totalRefunded,
		isFullyRefunded,
	};
}

/**
 * Create a customer portal session for managing billing
 */
export async function createCustomerPortalSession(
	customer_id: string,
	return_url: string
): Promise<Stripe.BillingPortal.Session> {
	const session = await stripe.billingPortal.sessions.create({
		customer: customer_id,
		return_url,
	});

	return session;
}

/**
 * Get subscription status from Stripe
 */
export async function getStripeSubscription(subscription_id: string): Promise<Stripe.Subscription> {
	return await stripe.subscriptions.retrieve(subscription_id);
}

/**
 * Cancel a subscription in Stripe
 */
export async function cancelStripeSubscription(subscription_id: string): Promise<Stripe.Subscription> {
	return await stripe.subscriptions.cancel(subscription_id);
}

/**
 * Get payment methods for a customer
 */
export async function getCustomerPaymentMethods(customer_id: string): Promise<Stripe.PaymentMethod[]> {
	const paymentMethods = await stripe.paymentMethods.list({
		customer: customer_id,
		type: 'card',
	});

	return paymentMethods.data;
}

/**
 * Update a Stripe subscription to a new price
 */
export async function updateStripeSubscription(
	subscription_id: string, 
	new_price_id: string
): Promise<Stripe.Subscription> {
	// Get the current subscription
	const subscription = await stripe.subscriptions.retrieve(subscription_id);
	
	// Update the subscription with the new price
	const updatedSubscription = await stripe.subscriptions.update(subscription_id, {
		items: [{
			id: subscription.items.data[0].id,
			price: new_price_id,
		}],
		proration_behavior: 'create_prorations', // This will prorate the billing
	});

	return updatedSubscription;
}

/**
 * Cancel a Stripe subscription immediately
 */
export async function cancelStripeSubscriptionImmediately(subscription_id: string): Promise<Stripe.Subscription> {
	return await stripe.subscriptions.cancel(subscription_id);
}

/**
 * Cancel a Stripe subscription at period end
 */
export async function cancelStripeSubscriptionAtPeriodEnd(subscription_id: string): Promise<Stripe.Subscription> {
	return await stripe.subscriptions.update(subscription_id, {
		cancel_at_period_end: true,
	});
} 