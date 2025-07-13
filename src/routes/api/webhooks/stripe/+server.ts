import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { env } from '$env/dynamic/private';
import PocketBase from 'pocketbase';
import type Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_WEBHOOK_SECRET) {
	throw new Error('STRIPE_WEBHOOK_SECRET is required');
}

// Create an admin-authenticated PocketBase instance for webhooks
async function getAdminPB() {
	const adminPB = new PocketBase('https://pocketbase.hoytlabs.cloud');
	
	// Authenticate as admin using environment variables
	const adminEmail = env.PB_EMAIL;
	const adminPassword = env.PB_PASSWORD;
	
	if (!adminEmail || !adminPassword) {
		throw new Error('PB_EMAIL and PB_PASSWORD are required for webhook operations');
	}
	
	try {
		await adminPB.admins.authWithPassword(adminEmail, adminPassword);
		return adminPB;
	} catch (error) {
		console.error('Failed to authenticate as admin:', error);
		throw new Error('Failed to authenticate as admin for webhook operation');
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return json({ error: 'Missing stripe-signature header' }, { status: 400 });
	}

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed':
				await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
				break;

			case 'invoice.payment_succeeded':
				await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
				break;

			case 'invoice.payment_failed':
				await handlePaymentFailed(event.data.object as Stripe.Invoice);
				break;

			case 'invoice.paid':
				await handleOneTimeInvoicePaid(event.data.object as Stripe.Invoice);
				break;

			case 'customer.subscription.updated':
				await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
				break;

			case 'customer.subscription.deleted':
				await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
				break;

			case 'charge.refunded':
				await handleChargeRefunded(event.data.object as Stripe.Charge);
				break;

			case 'invoice.voided':
				await handleInvoiceVoided(event.data.object as Stripe.Invoice);
				break;

			// Handle invoice lifecycle events (mostly informational)
			case 'invoiceitem.created':
			case 'invoice.created':
			case 'invoice.updated':
			case 'invoice.finalized':
			case 'invoice.sent':
				// These are informational events, we handle the important ones above
				console.log(`Invoice lifecycle event: ${event.type}`);
				break;

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return json({ received: true });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return json({ error: 'Webhook processing failed' }, { status: 500 });
	}
};

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
	const subscriptionId = session.metadata?.subscription_id;
	const stripeSubscriptionId = session.subscription;
	const stripeCustomerId = session.customer;

	if (!subscriptionId) {
		console.error('No subscription_id in checkout session metadata');
		return;
	}

	try {
		const adminPB = await getAdminPB();
		
		// First, let's check if the subscription exists
		let existingSubscription;
		try {
			existingSubscription = await adminPB.collection('subscriptions').getOne(subscriptionId);
		} catch (error) {
			// If subscription not found by ID, try to find a pending subscription for this customer
			// First, get the user ID from the Stripe customer
			const users = await adminPB.collection('users').getList(1, 1, {
				filter: `stripe_customer_id = "${stripeCustomerId}"`,
			});
			
			if (users.items.length > 0) {
				const user = users.items[0];
				
				// Look for pending subscriptions for this user
				const pendingSubscriptions = await adminPB.collection('subscriptions').getList(1, 10, {
					filter: `customer_id = "${user.id}" && status = "pending"`,
					sort: '-created'
				});
				
				if (pendingSubscriptions.items.length > 0) {
					existingSubscription = pendingSubscriptions.items[0];
				}
			}
			
			if (!existingSubscription) {
				throw error; // Re-throw original error if we can't find any subscription
			}
		}

		// Update subscription with Stripe IDs and set status to active
		await adminPB.collection('subscriptions').update(existingSubscription.id, {
			stripe_subscription_id: stripeSubscriptionId,
			status: 'active',
			start_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
		});

		// Update user with Stripe customer ID
		await adminPB.collection('users').update(existingSubscription.customer_id, {
			stripe_customer_id: stripeCustomerId,
		});

		console.log(`Subscription ${existingSubscription.id} activated successfully`);
	} catch (error) {
		console.error('Failed to update subscription after checkout:', error);
	}
}

/**
 * Handle one-time invoice paid
 */
async function handleOneTimeInvoicePaid(invoice: Stripe.Invoice) {
	// Check if this is a one-time invoice (not related to a subscription)
	if ((invoice as any).subscription) {
		return; // This is a subscription invoice, not a one-time invoice
	}

	try {
		const adminPB = await getAdminPB();
		
		// Find one-time invoice by Stripe invoice ID
		const oneTimeInvoices = await adminPB.collection('one_time_invoices').getList(1, 1, {
			filter: `stripe_invoice_id = "${invoice.id}"`,
		});

		if (oneTimeInvoices.items.length === 0) {
			console.log(`No one-time invoice found for Stripe invoice ${invoice.id}`);
			return;
		}

		const oneTimeInvoice = oneTimeInvoices.items[0];

		// Update one-time invoice status to paid and store PDF URL
		await adminPB.collection('one_time_invoices').update(oneTimeInvoice.id, {
			status: 'paid',
			invoice_pdf: invoice.invoice_pdf || undefined,
		});

		console.log(`One-time invoice ${oneTimeInvoice.id} marked as paid`);
	} catch (error) {
		console.error('Failed to handle one-time invoice paid:', error);
	}
}

/**
 * Handle successful payment (for subscriptions)
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
	// Handle both subscription invoices and one-time invoices
	if (!(invoice as any).subscription) {
		// This is a one-time invoice
		await handleOneTimeInvoicePaid(invoice);
		return;
	}

	// Access subscription ID from invoice lines or subscription property
	const stripeSubscriptionId = typeof (invoice as any).subscription === 'string' 
		? (invoice as any).subscription 
		: invoice.lines?.data?.[0]?.subscription;

	if (!stripeSubscriptionId) {
		return; // Not a subscription payment
	}

	try {
		const adminPB = await getAdminPB();
		
		// Find subscription by Stripe subscription ID
		const subscriptions = await adminPB.collection('subscriptions').getList(1, 1, {
			filter: `stripe_subscription_id = "${stripeSubscriptionId}"`,
		});

		if (subscriptions.items.length === 0) {
			console.error(`No subscription found for Stripe subscription ${stripeSubscriptionId}`);
			return;
		}

		const subscription = subscriptions.items[0];

		// Update subscription status to active if it was overdue
		if (subscription.status === 'overdue') {
			await adminPB.collection('subscriptions').update(subscription.id, {
				status: 'active',
			});
			console.log(`Subscription ${subscription.id} reactivated after successful payment`);
		}
	} catch (error) {
		console.error('Failed to handle payment succeeded:', error);
	}
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
	// Handle both subscription invoices and one-time invoices
	if (!(invoice as any).subscription) {
		// This is a one-time invoice
		try {
			const adminPB = await getAdminPB();
			
			// Find one-time invoice by Stripe invoice ID
			const oneTimeInvoices = await adminPB.collection('one_time_invoices').getList(1, 1, {
				filter: `stripe_invoice_id = "${invoice.id}"`,
			});

			if (oneTimeInvoices.items.length === 0) {
				console.log(`No one-time invoice found for Stripe invoice ${invoice.id}`);
				return;
			}

			const oneTimeInvoice = oneTimeInvoices.items[0];

			// Update one-time invoice status to uncollectible
			await adminPB.collection('one_time_invoices').update(oneTimeInvoice.id, {
				status: 'uncollectible',
			});

			console.log(`One-time invoice ${oneTimeInvoice.id} marked as uncollectible`);
		} catch (error) {
			console.error('Failed to handle one-time invoice payment failed:', error);
		}
		return;
	}

	// Access subscription ID from invoice lines or subscription property
	const stripeSubscriptionId = typeof (invoice as any).subscription === 'string' 
		? (invoice as any).subscription 
		: invoice.lines?.data?.[0]?.subscription;

	if (!stripeSubscriptionId) {
		return; // Not a subscription payment
	}

	try {
		const adminPB = await getAdminPB();
		
		// Find subscription by Stripe subscription ID
		const subscriptions = await adminPB.collection('subscriptions').getList(1, 1, {
			filter: `stripe_subscription_id = "${stripeSubscriptionId}"`,
		});

		if (subscriptions.items.length === 0) {
			console.error(`No subscription found for Stripe subscription ${stripeSubscriptionId}`);
			return;
		}

		const subscription = subscriptions.items[0];

		// Update subscription status to overdue
		await adminPB.collection('subscriptions').update(subscription.id, {
			status: 'overdue',
		});

		console.log(`Subscription ${subscription.id} marked as overdue due to payment failure`);
	} catch (error) {
		console.error('Failed to handle payment failed:', error);
	}
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	const stripeSubscriptionId = subscription.id;

	try {
		const adminPB = await getAdminPB();
		
		// Find subscription by Stripe subscription ID
		const subscriptions = await adminPB.collection('subscriptions').getList(1, 1, {
			filter: `stripe_subscription_id = "${stripeSubscriptionId}"`,
		});

		if (subscriptions.items.length === 0) {
			console.error(`No subscription found for Stripe subscription ${stripeSubscriptionId}`);
			return;
		}

		const localSubscription = subscriptions.items[0];

		// Prepare update data
		const updateData: { status?: string; end_date?: string } = {};

		// Update subscription status based on Stripe subscription status
		if (subscription.status === 'active') {
			updateData.status = 'active';
		} else if (subscription.status === 'canceled') {
			updateData.status = 'cancelled';
		} else if (subscription.status === 'past_due') {
			updateData.status = 'overdue';
		}

		// Handle cancel_at_period_end scenario
		if (subscription.cancel_at_period_end) {
			updateData.status = 'cancelled';
			// Set end date to when the subscription actually expires
			updateData.end_date = new Date((subscription as any).current_period_end * 1000).toISOString();
		}

		// If subscription is cancelled and has an ended_at timestamp, use that
		if (subscription.status === 'canceled' && subscription.ended_at) {
			updateData.end_date = new Date(subscription.ended_at * 1000).toISOString();
		}

		await adminPB.collection('subscriptions').update(localSubscription.id, updateData);

		console.log(`Subscription ${localSubscription.id} updated:`, updateData);
	} catch (error) {
		console.error('Failed to handle subscription update:', error);
	}
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	const stripeSubscriptionId = subscription.id;

	try {
		const adminPB = await getAdminPB();
		
		// Find subscription by Stripe subscription ID
		const subscriptions = await adminPB.collection('subscriptions').getList(1, 1, {
			filter: `stripe_subscription_id = "${stripeSubscriptionId}"`,
		});

		if (subscriptions.items.length === 0) {
			console.error(`No subscription found for Stripe subscription ${stripeSubscriptionId}`);
			return;
		}

		const localSubscription = subscriptions.items[0];

		// Update subscription status to cancelled
		await adminPB.collection('subscriptions').update(localSubscription.id, {
			status: 'cancelled',
			end_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
		});

		console.log(`Subscription ${localSubscription.id} cancelled`);
	} catch (error) {
		console.error('Failed to handle subscription deletion:', error);
	}
}

/**
 * Handle charge refund
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
	// Access subscription ID from charge metadata
	const stripeSubscriptionId = charge.metadata?.subscription_id;

	if (!stripeSubscriptionId) {
		return; // Not a subscription charge
	}

	try {
		const adminPB = await getAdminPB();
		
		// Find subscription by Stripe subscription ID
		const subscriptions = await adminPB.collection('subscriptions').getList(1, 1, {
			filter: `stripe_subscription_id = "${stripeSubscriptionId}"`,
		});

		if (subscriptions.items.length === 0) {
			console.error(`No subscription found for Stripe subscription ${stripeSubscriptionId}`);
			return;
		}

		const subscription = subscriptions.items[0];

		// Update subscription status to cancelled
		await adminPB.collection('subscriptions').update(subscription.id, {
			status: 'cancelled',
		});

		console.log(`Subscription ${subscription.id} cancelled due to charge refund`);
	} catch (error) {
		console.error('Failed to handle charge refund:', error);
	}
}

/**
 * Handle invoice voided
 */
async function handleInvoiceVoided(invoice: Stripe.Invoice) {
	// Handle both subscription invoices and one-time invoices
	if (!(invoice as any).subscription) {
		// This is a one-time invoice
		try {
			const adminPB = await getAdminPB();
			
			// Find one-time invoice by Stripe invoice ID
			const oneTimeInvoices = await adminPB.collection('one_time_invoices').getList(1, 1, {
				filter: `stripe_invoice_id = "${invoice.id}"`,
			});

			if (oneTimeInvoices.items.length === 0) {
				console.log(`No one-time invoice found for Stripe invoice ${invoice.id}`);
				return;
			}

			const oneTimeInvoice = oneTimeInvoices.items[0];

			// Update one-time invoice status to void
			await adminPB.collection('one_time_invoices').update(oneTimeInvoice.id, {
				status: 'void',
			});

			console.log(`One-time invoice ${oneTimeInvoice.id} marked as void`);
		} catch (error) {
			console.error('Failed to handle one-time invoice voided:', error);
		}
		return;
	}

	// Access subscription ID from invoice lines or subscription property
	const stripeSubscriptionId = typeof (invoice as any).subscription === 'string' 
		? (invoice as any).subscription 
		: invoice.lines?.data?.[0]?.subscription;

	if (!stripeSubscriptionId) {
		return; // Not a subscription payment
	}

	try {
		const adminPB = await getAdminPB();
		
		// Find subscription by Stripe subscription ID
		const subscriptions = await adminPB.collection('subscriptions').getList(1, 1, {
			filter: `stripe_subscription_id = "${stripeSubscriptionId}"`,
		});

		if (subscriptions.items.length === 0) {
			console.error(`No subscription found for Stripe subscription ${stripeSubscriptionId}`);
			return;
		}

		const subscription = subscriptions.items[0];

		// Update subscription status to cancelled
		await adminPB.collection('subscriptions').update(subscription.id, {
			status: 'cancelled',
		});

		console.log(`Subscription ${subscription.id} cancelled due to invoice voided`);
	} catch (error) {
		console.error('Failed to handle invoice voided:', error);
	}
} 