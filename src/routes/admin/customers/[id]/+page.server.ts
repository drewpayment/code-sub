import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { SubscriptionService } from '$lib/pocketbase';
import { stripe } from '$lib/server/stripe';
import type { SubscriptionStatus } from '$lib/types/subscription';


export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const customerId = params.id;
		
		// Check if user has admin permissions
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.role)) {
			throw error(403, 'Insufficient permissions');
		}

		// Use the user's authenticated PocketBase instance
		const userPB = locals.pb;

		// Fetch customer details
		const customer = await userPB.collection('users').getOne(customerId);

		// Fetch all plans for assignment
		const allPlansResponse = await userPB.collection('plans').getList(1, 50, {
			filter: 'is_active = true'
		});
		const allPlans = allPlansResponse.items;
		const subscriptionPlans = allPlans?.filter((plan) => plan.type === 'subscription');
		const projectPlans = allPlans?.filter((plan) => plan.type === 'one_time_project');

		// Fetch customer's current subscriptions
		const subscriptionsResponse = await userPB.collection('subscriptions').getList(1, 50, {
			filter: `customer_id = "${customerId}"`,
			expand: 'plan_id'
		});
		const subscriptions = subscriptionsResponse;

		// Fetch one-time invoices
		const oneTimeInvoicesResponse = await userPB.collection('one_time_invoices').getList(1, 50, {
			filter: `customer_id = "${customerId}"`,
			expand: 'plan_id',
			sort: '-created'
		});
		const oneTimeInvoices = oneTimeInvoicesResponse;

		return {
			customer,
			plans: subscriptionPlans,
			projectPlans,
			subscriptions: subscriptions.items,
			oneTimeInvoices: oneTimeInvoices.items
		};
	} catch (err) {
		console.error('Error loading customer data:', err);
		throw error(404, 'Customer not found');
	}
};

export const actions: Actions = {
	createOneTimeInvoice: async ({ request, params, locals }) => {
		try {
			const formData = await request.formData();
			const planId = formData.get('planId') as string;
			const amount = Number.parseFloat(formData.get('amount') as string);
			const customerId = params.id;

			if (!planId || !amount || !customerId) {
				return fail(400, { error: 'Plan ID, amount, and customer ID are required' });
			}

			// Debug authentication state
			console.log('locals.user:', locals.user);
			console.log('locals.pb.authStore.model:', locals.pb?.authStore?.model);
			console.log('locals.pb.authStore.isValid:', locals.pb?.authStore?.isValid);
			
			// Check if user has admin permissions and use their session
			if (!locals.user || !['admin', 'super_admin'].includes(locals.user.role)) {
				return fail(403, { error: 'Insufficient permissions' });
			}
			
			const userPB = locals.pb;
			
			console.log('--- STEP 0: BEFORE ANY STRIPE CALL ---');
			console.log('AuthStore Valid:', userPB.authStore.isValid);
			console.log('AuthStore Token:', userPB.authStore.token ? userPB.authStore.token.substring(0, 10) + '...' : 'NONE');
			console.log('AuthStore Model ID:', userPB.authStore.model?.id);

			console.log('Looking for customer with ID:', customerId);
			const customer = await userPB.collection('users').getOne(customerId);
			
			console.log('Found customer:', customer ? { id: customer.id, email: customer.email, stripe_customer_id: customer.stripe_customer_id } : 'null');
			if (!customer || !customer.stripe_customer_id) {
				return fail(400, { error: 'Customer not found or missing Stripe integration.' });
			}

			console.log('Looking for plan with ID:', planId);
			const plan = await userPB.collection('plans').getOne(planId);
			
			console.log('Found plan:', plan ? { id: plan.id, name: plan.name, type: plan.type } : 'null');
			if (!plan || plan.type !== 'one_time_project') {
				return fail(400, { error: 'Invalid one-time project plan selected.' });
			}
			
			if (amount < (plan.price_min ?? 0) || amount > (plan.price_max ?? Number.POSITIVE_INFINITY)) {
				return fail(400, { error: `Amount must be between $${plan.price_min} and $${plan.price_max}.` });
			}

			// Stripe requires amount in cents
			const amountInCents = Math.round(amount * 100);

			// 1. Create an Invoice first
			const invoice = await stripe.invoices.create({
				customer: customer.stripe_customer_id,
				collection_method: 'send_invoice',
				days_until_due: 30,
				auto_advance: false, // Don't auto-advance yet, we need to add items first
			});

			// Ensure invoice.id exists
			if (!invoice.id) {
				throw new Error('Failed to create Stripe invoice');
			}

			// 2. Create an Invoice Item and attach it to the invoice
			await stripe.invoiceItems.create({
				customer: customer.stripe_customer_id,
				invoice: invoice.id, // Attach to the specific invoice
				amount: amountInCents,
				currency: 'usd',
				description: plan.name
			});

			// 3. Finalize the invoice to calculate totals
			const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

			// Ensure finalizedInvoice.id exists
			if (!finalizedInvoice.id) {
				throw new Error('Failed to finalize Stripe invoice');
			}

			// 4. Send the invoice
			const finalInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id);

			// Ensure finalInvoice.id exists before creating local record
			if (!finalInvoice.id) {
				throw new Error('Failed to send Stripe invoice');
			}

			// WORKAROUND: Re-authenticate the PocketBase client.
			// The `stripe.invoiceItems.create` call inexplicably clears the authStore.
			// Reloading from the cookie restores the user's session before the final DB write.
			userPB.authStore.loadFromCookie(request.headers.get('cookie') || '');
			if (!userPB.authStore.isValid && locals.pb.authStore.token) {
				userPB.authStore.save(locals.pb.authStore.token, locals.pb.authStore.model);
			}

			// 5. Create local record
			const invoiceData = {
				customer_id: customerId,
				plan_id: planId,
				stripe_invoice_id: finalInvoice.id,
				status: finalInvoice.status ?? 'open',
				amount: amount,
				invoice_pdf: finalInvoice.invoice_pdf ?? undefined,
			};
			
			console.log('Creating one-time invoice with data:', invoiceData);
			
			// Debug the PB client before creating record
			console.log('userPB.authStore.isValid:', userPB.authStore.isValid);
			console.log('userPB.authStore.model.role:', userPB.authStore.model?.role);
			console.log('userPB.authStore.model.id:', userPB.authStore.model?.id);
			
			// Create the record using the user's authenticated client
			try {
				await userPB.collection('one_time_invoices').create(invoiceData);
				console.log('Successfully created one-time invoice record');
			} catch (pbError) {
				console.error('PocketBase create error details:', pbError);
				if (pbError && typeof pbError === 'object' && 'response' in pbError) {
					console.error('PocketBase response data:', pbError.response);
				}
				throw pbError;
			}

			return {
				success: true,
				message: `Invoice for ${plan.name} created and sent successfully.`
			};

		} catch (err: unknown) {
			console.error('Error creating one-time invoice:', err);
			const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
			return fail(500, { 
				error: errorMessage || 'Failed to create invoice. Please try again.' 
			});
		}
	},

	assignPlan: async ({ request, params }) => {
		try {
			const formData = await request.formData();
			const planId = formData.get('planId') as string;
			const customerId = params.id;

			if (!planId) {
				return fail(400, { error: 'Plan ID is required' });
			}

			// Create new subscription
			const subscription = await SubscriptionService.createSubscription({
				customer_id: customerId,
				plan_id: planId,
				status: 'pending',
				start_date: new Date().toISOString().split('T')[0]
			});

			return {
				success: true,
				message: 'Subscription assigned successfully',
				subscription
			};
		} catch (err) {
			console.error('Error assigning plan:', err);
			return fail(500, { 
				error: 'Failed to assign plan. Please try again.' 
			});
		}
	},

	updateSubscription: async ({ request }) => {
		try {
			const formData = await request.formData();
			const subscriptionId = formData.get('subscriptionId') as string;
			const status = formData.get('status') as string;
			const notes = formData.get('notes') as string;

			if (!subscriptionId || !status) {
				return fail(400, { error: 'Subscription ID and status are required' });
			}

			const updateData: { status: SubscriptionStatus; notes?: string; end_date?: string } = { status: status as SubscriptionStatus };
			
			if (notes) updateData.notes = notes;
			
			// Set end date if cancelling
			if (status === 'cancelled' || status === 'suspended') {
				updateData.end_date = new Date().toISOString().split('T')[0];
			}

			const subscription = await SubscriptionService.updateSubscription(subscriptionId, updateData);

			return {
				success: true,
				message: 'Subscription updated successfully',
				subscription
			};
		} catch (err) {
			console.error('Error updating subscription:', err);
			return fail(500, { 
				error: 'Failed to update subscription. Please try again.' 
			});
		}
	},

	deleteSubscription: async ({ request }) => {
		try {
			const formData = await request.formData();
			const subscriptionId = formData.get('subscriptionId') as string;

			if (!subscriptionId) {
				return fail(400, { error: 'Subscription ID is required' });
			}

			await SubscriptionService.deleteSubscription(subscriptionId);

			return {
				success: true,
				message: 'Subscription deleted successfully'
			};
		} catch (err) {
			console.error('Error deleting subscription:', err);
			return fail(500, { 
				error: 'Failed to delete subscription. Please try again.' 
			});
		}
	}
}; 