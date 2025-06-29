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
 * Get billing history for a customer
 */
export async function getCustomerBillingHistory(
	customer_id: string,
	limit = 100
): Promise<Stripe.Invoice[]> {
	const invoices = await stripe.invoices.list({
		customer: customer_id,
		limit,
		status: 'paid',
	});

	return invoices.data;
}

/**
 * Get recent billing history for customer (last 12 months)
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
	});

	return invoices.data;
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