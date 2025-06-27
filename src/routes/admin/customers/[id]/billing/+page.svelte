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
				<div class="py-8 text-center">
					<p class="text-gray-600">Customer has no Stripe customer ID. No billing history available.</p>
				</div>
			{:else if data.billingHistory.length === 0}
				<div class="py-8 text-center">
					<p class="text-gray-600">No billing history found for this customer.</p>
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