<script lang="ts">
	let { data } = $props();

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency.toUpperCase(),
		}).format(amount / 100); // Stripe amounts are in cents
	}

	const formatDate = (timestamp: number) => {
		return new Date(timestamp * 1000).toLocaleDateString();
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'paid':
				return 'bg-green-100 text-green-800';
			case 'open':
				return 'bg-yellow-100 text-yellow-800';
			case 'void':
				return 'bg-gray-100 text-gray-800';
			case 'uncollectible':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>Customer Billing - {data.customer.name || data.customer.email} - Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-10">
			<div class="mb-4">
				<a href="/admin/customers/{data.customer.id}" class="inline-flex items-center text-blue-600 hover:text-blue-700">
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
					</svg>
					Back to Customer Details
				</a>
			</div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
				Billing History
			</h1>
			<p class="text-gray-600">
				Complete billing history for {data.customer.name || data.customer.email}
			</p>
		</div>

		<!-- Customer Summary -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-semibold text-gray-900">Customer Summary</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<dt class="text-sm font-medium text-gray-500">Name</dt>
					<dd class="mt-1 text-sm text-gray-900">{data.customer.name || 'Not provided'}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Email</dt>
					<dd class="mt-1 text-sm text-gray-900">{data.customer.email}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Stripe Customer ID</dt>
					<dd class="mt-1 text-sm text-gray-900">{data.customer.stripe_customer_id || 'None'}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Current Subscription</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{#if data.subscription}
							{data.subscription.expand?.plan_id?.name} ({data.subscription.status})
						{:else}
							No active subscription
						{/if}
					</dd>
				</div>
			</div>
		</div>

		<!-- Billing History -->
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-6 text-xl font-semibold text-gray-900">Billing History</h2>
			
			{#if !data.customer.stripe_customer_id}
				<div class="rounded-md bg-yellow-50 p-4 mb-6">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-yellow-800">No Stripe Integration</h3>
							<div class="mt-2 text-sm text-yellow-700">
								<p>This customer has an active subscription but no Stripe customer ID. This could be because:</p>
								<ul class="mt-2 list-disc pl-5 space-y-1">
									<li>The subscription was assigned manually by an admin</li>
									<li>This is a legacy subscription from before Stripe integration</li>
									<li>The customer hasn't completed the payment setup process</li>
								</ul>
								{#if data.subscription}
									<div class="mt-4 p-3 bg-yellow-100 rounded-md">
										<h4 class="font-medium text-yellow-800">Current Subscription Details:</h4>
										<dl class="mt-2 text-sm text-yellow-700">
											<div class="flex justify-between">
												<dt>Plan:</dt>
												<dd class="font-medium">{data.subscription.expand?.plan_id?.name || 'Unknown Plan'}</dd>
											</div>
											<div class="flex justify-between">
												<dt>Status:</dt>
												<dd class="font-medium capitalize">{data.subscription.status}</dd>
											</div>
											<div class="flex justify-between">
												<dt>Started:</dt>
												<dd class="font-medium">{data.subscription.start_date ? new Date(data.subscription.start_date).toLocaleDateString() : 'Unknown'}</dd>
											</div>
											{#if data.subscription.stripe_subscription_id}
												<div class="flex justify-between">
													<dt>Stripe Subscription:</dt>
													<dd class="font-medium font-mono text-xs">{data.subscription.stripe_subscription_id}</dd>
												</div>
											{/if}
										</dl>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				
				<!-- Action Options -->
				{#if data.subscription && data.subscription.status === 'active'}
					<div class="rounded-md bg-blue-50 p-4 mb-6">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-blue-800">Migration Options</h3>
								<div class="mt-2 text-sm text-blue-700">
									<p>To enable Stripe billing for this customer:</p>
									<ol class="mt-2 list-decimal pl-5 space-y-1">
										<li>Have the customer log into their account</li>
										<li>Direct them to complete payment setup on their subscription page</li>
										<li>This will create a Stripe customer and enable billing history tracking</li>
									</ol>
								</div>
								<div class="mt-4">
									<a
										href="/account/subscription"
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
									>
										<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
										Customer Subscription Page
									</a>
								</div>
							</div>
						</div>
					</div>
				{/if}
			{:else if data.billingHistory.length === 0}
				<div class="py-8 text-center">
					<div class="mx-auto h-12 w-12 text-gray-400">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
						</svg>
					</div>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No billing history found</h3>
					<p class="mt-1 text-sm text-gray-500">
						This customer has a Stripe account but no payment transactions yet.
					</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
									Invoice ID
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
									Date
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
									Description
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
									Amount Paid
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
									Amount Due
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
									Status
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.billingHistory as invoice}
								<tr>
									<td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-900">
										{invoice.id}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
										{formatDate(invoice.created)}
									</td>
									<td class="px-6 py-4 text-sm text-gray-900">
										{invoice.description}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
										{formatCurrency(invoice.amount_paid, invoice.currency)}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
										{formatCurrency(invoice.amount_due, invoice.currency)}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm">
										<span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusColor(invoice.status)}">
											{invoice.status}
										</span>
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm">
										<div class="flex space-x-2">
											{#if invoice.hosted_invoice_url}
												<a 
													href={invoice.hosted_invoice_url} 
													target="_blank" 
													rel="noopener noreferrer"
													class="text-blue-600 hover:text-blue-700"
												>
													View
												</a>
											{/if}
											{#if invoice.invoice_pdf}
												<a 
													href={invoice.invoice_pdf} 
													target="_blank" 
													rel="noopener noreferrer"
													class="text-blue-600 hover:text-blue-700"
												>
													PDF
												</a>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div> 