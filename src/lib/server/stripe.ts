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
	const invoicesWithRefundStatus: Array<Stripe.Invoice & { displayStatus: Stripe.Invoice.Status }> = [];
	
	for (const invoice of invoices.data) {
		try {
			// Get the latest invoice data from Stripe
			const latestInvoice = await stripe.invoices.retrieve(invoice.id!);
			
			// Determine display status based on current state
			let displayStatus = latestInvoice.status;
			
			// Check if invoice was voided (refunded)
			if (latestInvoice.status === 'void') {
				displayStatus = 'void' as Stripe.Invoice.Status;
			}
			// Check if invoice has partial refunds by looking at amount_remaining
			else if (latestInvoice.amount_paid > 0 && latestInvoice.amount_remaining > 0) {
				displayStatus = 'void' as Stripe.Invoice.Status; // Use 'void' as closest status
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
	const charge = invoice.payments?.data.find(p => p.payment.type === 'charge');
	if (charge) {
		const chargeId = charge.id;
		
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

/**
 * Get dashboard metrics from Stripe
 */
export async function getStripeDashboardMetrics(): Promise<{
	active_subscriptions: number;
	past_due_subscriptions: number;
	cancelled_subscriptions: number;
	total_customers: number;
	mrr: number;
	failed_payments_this_month: number;
}> {
	try {
		// Get all subscriptions (paginated)
		const subscriptions = await stripe.subscriptions.list({
			limit: 100,
			expand: ['data.default_payment_method']
		});

		// Get all customers count
		const customers = await stripe.customers.list({
			limit: 1 // We only need the count
		});

		// Get failed charges from this month
		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);

		const failedCharges = await stripe.charges.list({
			limit: 100,
			created: {
				gte: Math.floor(startOfMonth.getTime() / 1000)
			},
			expand: ['data.outcome']
		});

		// Calculate metrics
		let active_subscriptions = 0;
		let past_due_subscriptions = 0;
		let cancelled_subscriptions = 0;
		let mrr = 0;

		for (const subscription of subscriptions.data) {
			switch (subscription.status) {
				case 'active':
					active_subscriptions++;
					// Calculate MRR (convert from cents and normalize to monthly)
					for (const item of subscription.items.data) {
						if (item.price.recurring) {
							let monthlyAmount = item.price.unit_amount || 0;
							
							// Convert to monthly based on interval
							switch (item.price.recurring.interval) {
								case 'year':
									monthlyAmount = monthlyAmount / 12;
									break;
								case 'week':
									monthlyAmount = monthlyAmount * 4.33; // Average weeks per month
									break;
								case 'day':
									monthlyAmount = monthlyAmount * 30; // Average days per month
									break;
								// 'month' stays the same
							}
							
							mrr += monthlyAmount;
						}
					}
					break;
				case 'past_due':
					past_due_subscriptions++;
					break;
				case 'canceled':
					cancelled_subscriptions++;
					break;
			}
		}

		// Count failed payments this month
		const failed_payments_this_month = failedCharges.data.filter(
			charge => charge.status === 'failed'
		).length;

		// Convert MRR from cents to dollars
		mrr = mrr / 100;

		return {
			active_subscriptions,
			past_due_subscriptions,
			cancelled_subscriptions,
			total_customers: customers.has_more ? 1000 : customers.data.length, // Approximation if has_more
			mrr,
			failed_payments_this_month
		};
	} catch (error) {
		console.error('Failed to fetch Stripe dashboard metrics:', error);
		return {
			active_subscriptions: 0,
			past_due_subscriptions: 0,
			cancelled_subscriptions: 0,
			total_customers: 0,
			mrr: 0,
			failed_payments_this_month: 0
		};
	}
}

/**
 * Get detailed customer financial metrics for admin billing page
 */
export async function getCustomerFinancials(customer_id: string): Promise<{
	metrics: {
		mrr: number;
		ltv: number;
		lifetimeEarnings: number;
		totalRefunded: number;
	};
	billingHistory: Array<{
		date: string;
		type: 'Payment' | 'Refund';
		amount: number;
		planName: string;
		status: string;
		detailsUrl: string;
	}>;
}> {
	try {
		// Get customer's active subscriptions for MRR calculation
		const subscriptions = await stripe.subscriptions.list({
			customer: customer_id,
			status: 'active',
			limit: 100
		});

		// Get all invoices for this customer
		const invoices = await stripe.invoices.list({
			customer: customer_id,
			limit: 100,
			expand: ['data.charge']
		});

		// Get all refunds for this customer
		const charges = await stripe.charges.list({
			customer: customer_id,
			limit: 100
		});

		// Calculate metrics
		let mrr = 0;
		let lifetimeEarnings = 0;
		let totalRefunded = 0;

		// Calculate MRR from active subscriptions
		for (const subscription of subscriptions.data) {
			for (const item of subscription.items.data) {
				if (item.price.recurring) {
					let monthlyAmount = item.price.unit_amount || 0;
					
					// Convert to monthly based on interval
					switch (item.price.recurring.interval) {
						case 'year':
							monthlyAmount = monthlyAmount / 12;
							break;
						case 'week':
							monthlyAmount = monthlyAmount * 4.33;
							break;
						case 'day':
							monthlyAmount = monthlyAmount * 30;
							break;
					}
					
					mrr += monthlyAmount;
				}
			}
		}

		// Calculate lifetime earnings from successful invoices
		for (const invoice of invoices.data) {
			if (invoice.status === 'paid') {
				lifetimeEarnings += invoice.amount_paid;
			}
		}

		// Calculate total refunded from charges
		for (const charge of charges.data) {
			totalRefunded += charge.amount_refunded;
		}

		// Convert from cents to dollars
		mrr = mrr / 100;
		lifetimeEarnings = lifetimeEarnings / 100;
		totalRefunded = totalRefunded / 100;
		
		const ltv = lifetimeEarnings - totalRefunded;

		// Build billing history array
		const billingHistory: Array<{
			date: string;
			type: 'Payment' | 'Refund';
			amount: number;
			planName: string;
			status: string;
			detailsUrl: string;
		}> = [];

		// Add payments from invoices
		for (const invoice of invoices.data) {
			billingHistory.push({
				date: new Date(invoice.created * 1000).toISOString(),
				type: 'Payment',
				amount: invoice.amount_paid / 100,
				planName: invoice.lines.data[0]?.description || 'Subscription',
				status: invoice.status || 'unknown',
				detailsUrl: invoice.hosted_invoice_url || `https://dashboard.stripe.com/invoices/${invoice.id || 'unknown'}`
			});
		}

		// Add refunds from charges
		for (const charge of charges.data) {
			if (charge.amount_refunded > 0) {
				// For simplicity, we'll add one refund entry per charge that has refunds
				billingHistory.push({
					date: new Date(charge.created * 1000).toISOString(),
					type: 'Refund',
					amount: -(charge.amount_refunded / 100), // Negative amount for refunds
					planName: charge.description || 'Refund',
					status: 'succeeded',
					detailsUrl: `https://dashboard.stripe.com/payments/${charge.id}`
				});
			}
		}

		// Sort by date, newest first
		billingHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return {
			metrics: {
				mrr,
				ltv,
				lifetimeEarnings,
				totalRefunded
			},
			billingHistory
		};
	} catch (error) {
		console.error('Failed to fetch customer financial data:', error);
		return {
			metrics: {
				mrr: 0,
				ltv: 0,
				lifetimeEarnings: 0,
				totalRefunded: 0
			},
			billingHistory: []
		};
	}
} 