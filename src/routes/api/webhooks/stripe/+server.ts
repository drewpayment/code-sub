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
		console.log('Successfully authenticated as admin for webhook operation');
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

			case 'customer.subscription.updated':
				await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
				break;

			case 'customer.subscription.deleted':
				await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
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

	console.log('=== CHECKOUT COMPLETED DEBUG ===');
	console.log('Session metadata:', session.metadata);
	console.log('Subscription ID from metadata:', subscriptionId);
	console.log('Stripe subscription ID:', stripeSubscriptionId);
	console.log('Stripe customer ID:', stripeCustomerId);

	if (!subscriptionId) {
		console.error('No subscription_id in checkout session metadata');
		return;
	}

	try {
		const adminPB = await getAdminPB();
		console.log(`Attempting to update subscription ${subscriptionId}...`);
		
		// First, let's check if the subscription exists
		let existingSubscription;
		try {
			existingSubscription = await adminPB.collection('subscriptions').getOne(subscriptionId);
			console.log('Found existing subscription:', {
				id: existingSubscription.id,
				status: existingSubscription.status,
				customer_id: existingSubscription.customer_id
			});
		} catch (error) {
			console.log('Subscription not found by ID, trying to find by customer and status...');
			
			// If subscription not found by ID, try to find a pending subscription for this customer
			// First, get the user ID from the Stripe customer
			const users = await adminPB.collection('users').getList(1, 1, {
				filter: `stripe_customer_id = "${stripeCustomerId}"`,
			});
			
			if (users.items.length > 0) {
				const user = users.items[0];
				console.log('Found user by Stripe customer ID:', user.id);
				
				// Look for pending subscriptions for this user
				const pendingSubscriptions = await adminPB.collection('subscriptions').getList(1, 10, {
					filter: `customer_id = "${user.id}" && status = "pending"`,
					sort: '-created'
				});
				
				console.log('Found pending subscriptions:', pendingSubscriptions.items.length);
				
				if (pendingSubscriptions.items.length > 0) {
					existingSubscription = pendingSubscriptions.items[0];
					console.log('Using most recent pending subscription:', existingSubscription.id);
				}
			}
			
			if (!existingSubscription) {
				throw error; // Re-throw original error if we can't find any subscription
			}
		}

		// Update subscription with Stripe IDs and set status to active
		const updateResult = await adminPB.collection('subscriptions').update(existingSubscription.id, {
			stripe_subscription_id: stripeSubscriptionId,
			status: 'active',
			start_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
		});
		
		console.log('Subscription update result:', updateResult);

		// Update user with Stripe customer ID
		console.log(`Updating user ${existingSubscription.customer_id} with Stripe customer ID...`);
		const userUpdateResult = await adminPB.collection('users').update(existingSubscription.customer_id, {
			stripe_customer_id: stripeCustomerId,
		});
		
		console.log('User update result:', userUpdateResult);

		console.log(`Subscription ${existingSubscription.id} activated successfully`);
	} catch (error) {
		console.error('Failed to update subscription after checkout:', error);
		console.error('Error details:', {
			name: (error as Error).name,
			message: (error as Error).message,
			status: (error as any).status,
			data: (error as any).data
		});
	}
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
	// Access subscription ID from invoice lines or subscription property
	const stripeSubscriptionId = typeof invoice.subscription === 'string' 
		? invoice.subscription 
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
	// Access subscription ID from invoice lines or subscription property
	const stripeSubscriptionId = typeof invoice.subscription === 'string' 
		? invoice.subscription 
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

		// Update subscription status based on Stripe subscription status
		let status = localSubscription.status;
		if (subscription.status === 'active') {
			status = 'active';
		} else if (subscription.status === 'canceled') {
			status = 'cancelled';
		} else if (subscription.status === 'past_due') {
			status = 'overdue';
		}

		await adminPB.collection('subscriptions').update(localSubscription.id, {
			status,
		});

		console.log(`Subscription ${localSubscription.id} updated to status: ${status}`);
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