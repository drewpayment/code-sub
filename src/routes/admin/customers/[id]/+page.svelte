<script lang="ts">
	export let data: any;
	export let form: any;

	const formatDate = (date: string | null): string => {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString();
	};

	const getStatusColor = (status: string): string => {
		if (status === 'active') return 'bg-green-100 text-green-800';
		if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
		if (status === 'cancelled') return 'bg-red-100 text-red-800';
		return 'bg-gray-100 text-gray-800';
	};

	const handleDeleteClick = (e: Event) => {
		if (!confirm('Are you sure you want to delete this subscription?')) {
			e.preventDefault();
		}
	};
</script>

<svelte:head>
	<title>Manage Customer - {data.customer.name || data.customer.email}</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<!-- Customer Header -->
	<div class="bg-white shadow rounded-lg mb-6">
		<div class="px-6 py-4 border-b border-gray-200">
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
		</div>
		<div class="px-6 py-4">
			<dl class="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
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
			</dl>
		</div>
	</div>

	<!-- Current Subscriptions -->
	<div class="bg-white shadow rounded-lg mb-6">
		<div class="px-6 py-4 border-b border-gray-200">
			<h2 class="text-lg font-medium text-gray-900">Current Subscriptions</h2>
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
							<div class="mt-3 flex space-x-2">
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