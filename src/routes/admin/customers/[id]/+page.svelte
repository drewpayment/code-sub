<script lang="ts">
	export let data: any;
	export let form: any;

	let selectedPlan: any = null;
	let invoiceAmount = '';

	const formatDate = (date: string | null): string => {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString();
	};

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	};

	const getStatusColor = (status: string): string => {
		if (status === 'active') return 'bg-green-100 text-green-800';
		if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
		if (status === 'cancelled') return 'bg-red-100 text-red-800';
		return 'bg-gray-100 text-gray-800';
	};

	const getInvoiceStatusColor = (status: string): string => {
		if (status === 'paid') return 'bg-green-100 text-green-800';
		if (status === 'open') return 'bg-blue-100 text-blue-800';
		if (status === 'draft') return 'bg-gray-100 text-gray-800';
		if (status === 'uncollectible') return 'bg-red-100 text-red-800';
		if (status === 'void') return 'bg-gray-100 text-gray-800';
		return 'bg-gray-100 text-gray-800';
	};

	const handleDeleteClick = (e: Event) => {
		if (!confirm('Are you sure you want to delete this subscription?')) {
			e.preventDefault();
		}
	};

	const handlePlanChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		const planId = target.value;
		selectedPlan = data.projectPlans?.find((plan: any) => plan.id === planId) || null;
		
		// Reset amount when plan changes
		invoiceAmount = '';
	};

	const validateAmount = (): boolean => {
		if (!selectedPlan || !invoiceAmount) return false;
		
		const amount = Number.parseFloat(invoiceAmount);
		const minPrice = selectedPlan.price_min || 0;
		const maxPrice = selectedPlan.price_max || Number.POSITIVE_INFINITY;
		
		return amount >= minPrice && amount <= maxPrice;
	};

	const getAmountError = (): string => {
		if (!selectedPlan || !invoiceAmount) return '';
		
		const amount = Number.parseFloat(invoiceAmount);
		const minPrice = selectedPlan.price_min || 0;
		const maxPrice = selectedPlan.price_max || Number.POSITIVE_INFINITY;
		
		if (amount < minPrice) {
			return `Amount must be at least ${formatCurrency(minPrice)}`;
		}
		if (amount > maxPrice) {
			return `Amount must not exceed ${formatCurrency(maxPrice)}`;
		}
		return '';
	};
</script>

<svelte:head>
	<title>Manage Customer - {data.customer.name || data.customer.email}</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<!-- Customer Header -->
	<div class="bg-white shadow rounded-lg mb-6">
		<div class="px-6 py-4 border-b border-gray-200">
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
						<span class="text-lg font-medium text-gray-700">
							{(data.customer.name || data.customer.email || '').charAt(0).toUpperCase()}
						</span>
					</div>
					<div class="ml-4">
						<h1 class="text-xl font-semibold text-gray-900">
							{data.customer.name || 'No name set'}
						</h1>
						<p class="text-sm text-gray-500">{data.customer.email}</p>
					</div>
				</div>
				
				<!-- Customer Actions -->
				<div class="flex space-x-3">
					<a
						href="/admin/customers/{data.customer.id}/billing"
						class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
						</svg>
						{#if data.customer.stripe_customer_id}
							View Billing History
						{:else}
							View Billing Status
						{/if}
					</a>
					{#if data.customer.stripe_customer_id}
						<a
							href="https://dashboard.stripe.com/customers/{data.customer.stripe_customer_id}"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
							</svg>
							Stripe Dashboard
						</a>
					{:else}
						<div class="inline-flex items-center px-3 py-2 border border-yellow-300 shadow-sm text-sm font-medium rounded-md text-yellow-700 bg-yellow-50">
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
							</svg>
							No Stripe Integration
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="px-6 py-4">
			<dl class="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3">
				<div>
					<dt class="text-sm font-medium text-gray-500">Role</dt>
					<dd class="text-sm text-gray-900">{data.customer.role}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Verified</dt>
					<dd class="text-sm text-gray-900">{data.customer.verified ? 'Yes' : 'No'}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Joined</dt>
					<dd class="text-sm text-gray-900">{formatDate(data.customer.created)}</dd>
				</div>
				{#if data.customer.stripe_customer_id}
					<div>
						<dt class="text-sm font-medium text-gray-500">Stripe Customer ID</dt>
						<dd class="text-sm text-gray-900 font-mono">{data.customer.stripe_customer_id}</dd>
					</div>
				{:else}
					<div>
						<dt class="text-sm font-medium text-gray-500">Payment Integration</dt>
						<dd class="text-sm text-yellow-600 font-medium">Not configured</dd>
					</div>
				{/if}
			</dl>
		</div>
	</div>

	<!-- Current Subscriptions -->
	<div class="bg-white shadow rounded-lg mb-6">
		<div class="px-6 py-4 border-b border-gray-200">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-medium text-gray-900">Current Subscriptions</h2>
				{#if data.customer.stripe_customer_id}
					<a
						href="/admin/customers/{data.customer.id}/billing"
						class="text-sm text-blue-600 hover:text-blue-700 font-medium"
					>
						View Full Billing History →
					</a>
				{/if}
			</div>
		</div>
		<div class="px-6 py-4">
			{#if data.subscriptions && data.subscriptions.length > 0}
				<div class="space-y-4">
					{#each data.subscriptions as subscription}
						<div class="border rounded-lg p-4">
							<div class="flex items-center justify-between">
								<div>
									<h3 class="text-sm font-medium text-gray-900">
										{subscription.expand?.plan_id?.name || 'Unknown Plan'}
									</h3>
									<p class="text-sm text-gray-500">
										${subscription.expand?.plan_id?.price || 0}/month
									</p>
									{#if subscription.stripe_subscription_id}
										<p class="text-xs text-gray-400 font-mono mt-1">
											Stripe: {subscription.stripe_subscription_id}
										</p>
									{/if}
								</div>
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(subscription.status)}">
									{subscription.status}
								</span>
							</div>
							
							{#if subscription.start_date}
								<p class="mt-2 text-xs text-gray-500">
									Started: {formatDate(subscription.start_date)}
								</p>
							{/if}
							
							{#if subscription.notes}
								<p class="mt-2 text-xs text-gray-600">{subscription.notes}</p>
							{/if}

							<!-- Quick Actions -->
							<div class="mt-3 flex flex-wrap gap-2">
								{#if data.customer.stripe_customer_id}
									<a
										href="/admin/customers/{data.customer.id}/billing"
										class="text-xs px-3 py-1 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-50 inline-flex items-center"
									>
										<svg class="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
										</svg>
										Billing
									</a>
								{/if}
								
								<form method="POST" action="?/updateSubscription" class="inline">
									<input type="hidden" name="subscriptionId" value={subscription.id} />
									<input type="hidden" name="status" value={subscription.status === 'active' ? 'suspended' : 'active'} />
									<button 
										type="submit"
										class="text-xs px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
									>
										{subscription.status === 'active' ? 'Suspend' : 'Activate'}
									</button>
								</form>
								
								<form method="POST" action="?/deleteSubscription" class="inline">
									<input type="hidden" name="subscriptionId" value={subscription.id} />
									<button 
										type="submit"
										class="text-xs px-3 py-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
										on:click={handleDeleteClick}
									>
										Delete
									</button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-gray-500">No active subscriptions</p>
			{/if}
		</div>
	</div>

	<!-- Stripe Integration Alert for Active Subscriptions -->
	{#if !data.customer.stripe_customer_id && data.subscriptions && data.subscriptions.some((sub: any) => sub.status === 'active')}
		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-yellow-800">Active Subscription Without Payment Integration</h3>
					<div class="mt-2 text-sm text-yellow-700">
						<p>This customer has an active subscription but hasn't set up Stripe billing. This means:</p>
						<ul class="mt-1 list-disc pl-5 space-y-1">
							<li>No automated billing is occurring</li>
							<li>No payment history is being tracked</li>
							<li>Manual subscription management is required</li>
						</ul>
						<p class="mt-2">
							<strong>To resolve:</strong> Have the customer complete payment setup from their account page, or consider migrating this subscription to Stripe billing.
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- One-Time Invoice Creation -->
	{#if data.customer.stripe_customer_id && data.projectPlans && data.projectPlans.length > 0}
		<div class="bg-white shadow rounded-lg mb-6">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-medium text-gray-900">Create One-Time Invoice</h2>
			</div>
			<div class="px-6 py-4">
				{#if form?.error}
					<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<p class="text-sm text-red-600">{form.error}</p>
					</div>
				{/if}
				
				{#if form?.success}
					<div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
						<p class="text-sm text-green-600">{form.message}</p>
					</div>
				{/if}

				<form method="POST" action="?/createOneTimeInvoice" class="space-y-4">
					<div>
						<label for="projectPlanId" class="block text-sm font-medium text-gray-700">Select Project Plan</label>
						<select 
							name="planId" 
							id="projectPlanId" 
							required
							on:change={handlePlanChange}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						>
							<option value="">Choose a project plan...</option>
							{#each data.projectPlans as plan}
								<option value={plan.id}>
									{plan.name} - {formatCurrency(plan.price_min)} to {formatCurrency(plan.price_max)}
								</option>
							{/each}
						</select>
					</div>

					{#if selectedPlan}
						<div>
							<label for="amount" class="block text-sm font-medium text-gray-700">
								Amount (${formatCurrency(selectedPlan.price_min)} - {formatCurrency(selectedPlan.price_max)})
							</label>
							<div class="mt-1 relative rounded-md shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-gray-500 sm:text-sm">$</span>
								</div>
								<input
									type="number"
									name="amount"
									id="amount"
									step="0.01"
									min={selectedPlan.price_min}
									max={selectedPlan.price_max}
									bind:value={invoiceAmount}
									required
									class="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="0.00"
								/>
							</div>
							{#if getAmountError()}
								<p class="mt-1 text-sm text-red-600">{getAmountError()}</p>
							{/if}
						</div>

						<div class="bg-gray-50 p-3 rounded-md">
							<h4 class="text-sm font-medium text-gray-900 mb-2">{selectedPlan.name}</h4>
							{#if selectedPlan.description}
								<p class="text-sm text-gray-600 mb-2">{selectedPlan.description}</p>
							{/if}
							{#if selectedPlan.features && Array.isArray(selectedPlan.features)}
								<ul class="text-sm text-gray-600 space-y-1">
									{#each selectedPlan.features as feature}
										<li class="flex items-center">
											<svg class="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
											</svg>
											{feature}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/if}
					
					<div>
						<button 
							type="submit"
							disabled={!validateAmount()}
							class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							Create & Send Invoice
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- One-Time Invoice History -->
	{#if data.oneTimeInvoices && data.oneTimeInvoices.length > 0}
		<div class="bg-white shadow rounded-lg mb-6">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-medium text-gray-900">One-Time Invoice History</h2>
			</div>
			<div class="px-6 py-4">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Plan
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Amount
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Date Created
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each data.oneTimeInvoices as invoice}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{invoice.expand?.plan_id?.name || 'Unknown Plan'}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{formatCurrency(invoice.amount)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getInvoiceStatusColor(invoice.status)}">
											{invoice.status}
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatDate(invoice.created)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{#if invoice.invoice_pdf}
											<a
												href={invoice.invoice_pdf}
												target="_blank"
												rel="noopener noreferrer"
												class="text-blue-600 hover:text-blue-700 inline-flex items-center"
											>
												<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
												</svg>
												View PDF
											</a>
										{:else}
											<span class="text-gray-400">No PDF</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}

	<!-- Assign New Plan -->
	<div class="bg-white shadow rounded-lg">
		<div class="px-6 py-4 border-b border-gray-200">
			<h2 class="text-lg font-medium text-gray-900">Assign New Plan</h2>
		</div>
		<div class="px-6 py-4">
			{#if form?.error}
				<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
					<p class="text-sm text-red-600">{form.error}</p>
				</div>
			{/if}
			
			{#if form?.success}
				<div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
					<p class="text-sm text-green-600">{form.message}</p>
				</div>
			{/if}

			<form method="POST" action="?/assignPlan" class="space-y-4">
				<div>
					<label for="planId" class="block text-sm font-medium text-gray-700">Select Plan</label>
					<select 
						name="planId" 
						id="planId" 
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
					>
						<option value="">Choose a plan...</option>
						{#if data.plans}
							{#each data.plans as plan}
								<option value={plan.id}>
									{plan.name} - ${plan.price}/month
								</option>
							{/each}
						{/if}
					</select>
				</div>
				
				<div>
					<button 
						type="submit"
						class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Assign Plan
					</button>
				</div>
			</form>
		</div>
	</div>
</div> 