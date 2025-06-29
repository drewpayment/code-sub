<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	const currentPlan = $derived(data.currentSubscription?.expand?.plan_id);
	const hasActiveSubscription = $derived(
		data.currentSubscription && data.currentSubscription.status === 'active'
	);

	const getStatusInfo = (status: string) => {
		const statusMap = {
			active: {
				text: 'Active',
				color: 'text-green-600',
				bgColor: 'bg-green-100',
				borderColor: 'border-green-200'
			},
			pending: {
				text: 'Pending Setup',
				color: 'text-yellow-600',
				bgColor: 'bg-yellow-100',
				borderColor: 'border-yellow-200'
			},
			overdue: {
				text: 'Payment Overdue',
				color: 'text-red-600',
				bgColor: 'bg-red-100',
				borderColor: 'border-red-200'
			},
			cancelled: {
				text: 'Cancelled',
				color: 'text-red-600',
				bgColor: 'bg-red-100',
				borderColor: 'border-red-200'
			},
			suspended: {
				text: 'Suspended',
				color: 'text-orange-600',
				bgColor: 'bg-orange-100',
				borderColor: 'border-orange-200'
			}
		};
		return statusMap[status as keyof typeof statusMap] || statusMap.pending;
	};

	const statusDisplay = $derived(
		data.currentSubscription ? getStatusInfo(data.currentSubscription.status) : null
	);

	let showCancelConfirm = $state(false);
	let billingHistory: any[] = $state([]);
	let loadingHistory = $state(false);
	let showBillingHistory = $state(false);

	// Load billing history when component mounts
	onMount(async () => {
		if (data.currentSubscription && data.user.stripe_customer_id) {
			await loadBillingHistory();
		}
	});

	async function loadBillingHistory() {
		loadingHistory = true;
		try {
			const response = await fetch('/api/billing/history');
			const result = await response.json();
			if (response.ok) {
				billingHistory = result.invoices || [];
			} else {
				console.error('Failed to load billing history:', result.error);
			}
		} catch (error) {
			console.error('Failed to load billing history:', error);
		} finally {
			loadingHistory = false;
		}
	}

	function formatCurrency(amount: number, currency: string) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency.toUpperCase(),
		}).format(amount / 100); // Stripe amounts are in cents
	}

	function formatDate(timestamp: number) {
		return new Date(timestamp * 1000).toLocaleDateString();
	}
</script>

<svelte:head>
	<title>Subscription Management - My Account</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-10 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">Subscription Management</h1>
			<p class="text-gray-600">Manage your subscription plans and billing.</p>
		</div>

		<!-- Back to Account Link -->
		<div class="mb-6">
			<a href="/account" class="inline-flex items-center text-blue-600 hover:text-blue-700">
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
					></path>
				</svg>
				Back to Account
			</a>
		</div>

		<!-- Form Messages -->
		{#if form?.error}
			<div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
				<p class="text-sm text-red-600">{form.error}</p>
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
				<p class="text-sm text-green-600">{form.message}</p>
			</div>
		{/if}

		<!-- Current Subscription (if exists) -->
		{#if data.currentSubscription && currentPlan}
			<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">Current Subscription</h2>

				<div class="mb-4 flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900">{currentPlan.name}</h3>
						<p class="text-gray-600">{currentPlan.description || ''}</p>
					</div>
					<div class="text-right">
						<p class="text-2xl font-bold text-gray-900">${currentPlan.price}</p>
						<p class="text-sm text-gray-500 capitalize">/{currentPlan.billing_period}</p>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div>
						<span
							class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {statusDisplay?.color} {statusDisplay?.bgColor} border {statusDisplay?.borderColor}"
						>
							{statusDisplay?.text}
						</span>
					</div>

					<div class="flex space-x-3">
						{#if data.currentSubscription.status === 'pending'}
							<form method="POST" action="?/createCheckoutSession" use:enhance>
								<button
									type="submit"
									class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									Complete Setup & Activate
								</button>
							</form>
						{:else if data.currentSubscription.status === 'overdue'}
							<form method="POST" action="?/createCheckoutSession" use:enhance>
								<button
									type="submit"
									class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
								>
									Update Payment Method
								</button>
							</form>
						{:else if data.currentSubscription.status === 'active'}
							<button
								on:click={() => (showCancelConfirm = true)}
								class="text-sm font-medium text-red-600 hover:text-red-700"
							>
								Cancel Subscription
							</button>
						{/if}
					</div>
				</div>

				<!-- Overdue Payment Warning -->
				{#if data.currentSubscription.status === 'overdue'}
					<div class="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-red-800">Payment Required</h3>
								<div class="mt-2 text-sm text-red-700">
									<p>Your payment is overdue. Please update your payment method to continue using your subscription.</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Plan Features -->
				{#if currentPlan.features}
					<div class="mt-4 border-t border-gray-200 pt-4">
						<h4 class="mb-2 text-sm font-medium text-gray-900">Plan Features:</h4>
						<div class="text-sm text-gray-600">
							{#if typeof currentPlan.features === 'object'}
								<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
									{#each Object.entries(currentPlan.features) as [key, value]}
										<div class="flex justify-between">
											<span class="capitalize">{key.replace(/_/g, ' ')}:</span>
											<span>{typeof value === 'boolean' ? (value ? '✓' : '✗') : value}</span>
										</div>
									{/each}
								</div>
							{:else}
								<p>{currentPlan.features}</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Billing History (if user has Stripe customer ID) -->
		{#if data.currentSubscription && data.user.stripe_customer_id}
			<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-xl font-semibold text-gray-900">Billing History</h2>
					<button
						on:click={() => (showBillingHistory = !showBillingHistory)}
						class="text-sm font-medium text-blue-600 hover:text-blue-700"
					>
						{showBillingHistory ? 'Hide' : 'Show'} History
					</button>
				</div>

				{#if showBillingHistory}
					{#if loadingHistory}
						<div class="py-8 text-center">
							<div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
							<p class="mt-2 text-sm text-gray-600">Loading billing history...</p>
						</div>
					{:else if billingHistory.length === 0}
						<div class="py-8 text-center">
							<p class="text-gray-600">No billing history found.</p>
						</div>
					{:else}
						<div class="overflow-hidden">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gray-50">
									<tr>
										<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
											Date
										</th>
										<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
											Description
										</th>
										<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
											Amount
										</th>
										<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
											Status
										</th>
										<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
											Invoice
										</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 bg-white">
									{#each billingHistory as invoice}
										<tr>
											<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
												{formatDate(invoice.created)}
											</td>
											<td class="px-6 py-4 text-sm text-gray-900">
												{invoice.description}
											</td>
											<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
												{formatCurrency(invoice.amount_paid, invoice.currency)}
											</td>
											<td class="whitespace-nowrap px-6 py-4 text-sm">
												<span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold
													{invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
													invoice.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
													'bg-red-100 text-red-800'}">
													{invoice.status}
												</span>
											</td>
											<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
												{#if invoice.hosted_invoice_url}
													<a 
														href={invoice.hosted_invoice_url} 
														target="_blank" 
														rel="noopener noreferrer"
														class="text-blue-600 hover:text-blue-700"
													>
														View Invoice
													</a>
												{:else}
													<span class="text-gray-400">N/A</span>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				{/if}
			</div>
		{/if}

		<!-- Available Plans -->
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-6 text-xl font-semibold text-gray-900">
				{data.currentSubscription ? 'Available Plans' : 'Choose a Plan'}
			</h2>

			{#if data.plans && data.plans.length > 0}
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each data.plans as plan}
						<div
							class="rounded-lg border border-gray-200 p-6 {currentPlan?.id === plan.id
								? 'bg-blue-50 ring-2 ring-blue-500'
								: 'hover:border-gray-300'}"
						>
							<!-- Plan Header -->
							<div class="mb-4 text-center">
								<h3 class="text-lg font-semibold text-gray-900">{plan.name}</h3>
								<p class="mt-1 text-sm text-gray-600">{plan.description || ''}</p>
								<div class="mt-4">
									<span class="text-3xl font-bold text-gray-900">${plan.price}</span>
									<span class="text-gray-500 capitalize">/{plan.billing_period}</span>
								</div>
							</div>

							<!-- Current Plan Badge -->
							{#if currentPlan?.id === plan.id}
								<div class="mb-4 text-center">
									<span
										class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
									>
										Current Plan
									</span>
								</div>
							{/if}

							<!-- Plan Features -->
							{#if plan.features}
								<div class="mb-6">
									<h4 class="mb-2 text-sm font-medium text-gray-900">Features:</h4>
									<div class="space-y-1 text-sm text-gray-600">
										{#if typeof plan.features === 'object'}
											{#each Object.entries(plan.features) as [key, value]}
												<div class="flex justify-between">
													<span class="capitalize">{key.replace(/_/g, ' ')}:</span>
													<span>{typeof value === 'boolean' ? (value ? '✓' : '✗') : value}</span>
												</div>
											{/each}
										{:else}
											<p>{plan.features}</p>
										{/if}
									</div>
								</div>
							{/if}

							<!-- Action Button -->
							<div class="text-center">
								{#if currentPlan?.id === plan.id}
									<div class="text-sm text-gray-500">This is your current plan</div>
								{:else if hasActiveSubscription}
									<form method="POST" action="?/changePlan" use:enhance>
										<input type="hidden" name="plan_id" value={plan.id} />
										<button
											type="submit"
											class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
										>
											Switch to This Plan
										</button>
									</form>
								{:else}
									<form method="POST" action="?/subscribe" use:enhance>
										<input type="hidden" name="plan_id" value={plan.id} />
										<button
											type="submit"
											class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
										>
											Subscribe to This Plan
										</button>
									</form>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="py-8 text-center">
					<p class="text-gray-600">No plans are currently available. Please contact support.</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Cancel Confirmation Modal -->
{#if showCancelConfirm}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6">
			<h3 class="mb-4 text-lg font-semibold text-gray-900">Cancel Subscription</h3>
			<p class="mb-6 text-gray-600">
				Are you sure you want to cancel your subscription? This action cannot be undone and you will
				lose access to your plan features.
			</p>
			<div class="flex space-x-3">
				<button
					on:click={() => (showCancelConfirm = false)}
					class="flex-1 rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
				>
					Keep Subscription
				</button>
				<form method="POST" action="?/cancelSubscription" use:enhance class="flex-1">
					<button
						type="submit"
						on:click={() => (showCancelConfirm = false)}
						class="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					>
						Cancel Subscription
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
