<script lang="ts">
	export let data: any;
	export let form: any;
	
	let showCreateForm = false;
	let selectedPlanType: 'subscription' | 'one_time_project' = 'subscription';
	
	const scrollToForm = () => {
		showCreateForm = true;
		// Scroll to the form after a brief delay to ensure it's rendered
		setTimeout(() => {
			const formElement = document.getElementById('quick-add-form');
			if (formElement) {
				formElement.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100);
	};

	// Helper function to format price display
	function formatPrice(plan: any) {
		if (plan.type === 'one_time_project') {
			return `$${plan.price_min} - $${plan.price_max}`;
		}
		return `$${plan.price}`;
	}

	// Helper function to format billing period display
	function formatBilling(plan: any) {
		if (plan.type === 'one_time_project') {
			return 'One-time';
		}
		return plan.billing_period ? plan.billing_period.charAt(0).toUpperCase() + plan.billing_period.slice(1) : '';
	}

	// Helper function to format plan type display
	function formatPlanType(plan: any) {
		if (plan.type === 'one_time_project') {
			return 'One-Time Project';
		}
		return 'Subscription';
	}
</script>

<svelte:head>
	<title>Plan Management - Admin Dashboard</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
	<!-- Header -->
	<div class="bg-white shadow rounded-lg mb-6">
		<div class="px-6 py-4 border-b border-gray-200">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-xl font-semibold text-gray-900">Plan Management</h1>
					<p class="mt-1 text-sm text-gray-500">
						Manage subscription plans and pricing
					</p>
				</div>
				<button 
					type="button"
					on:click={scrollToForm}
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Add New Plan
				</button>
			</div>
		</div>
	</div>

	<!-- Form Messages -->
	{#if form?.error}
		<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
			<p class="text-sm text-red-600">{form.error}</p>
		</div>
	{/if}
	
	{#if form?.success}
		<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
			<p class="text-sm text-green-600">{form.message}</p>
		</div>
	{/if}

	<!-- Plans List -->
	<div class="bg-white shadow rounded-lg">
		<div class="overflow-x-auto">
			{#if data.plans && data.plans.length > 0}
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
								Plan
							</th>
							<th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
								Type
							</th>
							<th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
								Price
							</th>
							<th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] hidden sm:table-cell">
								Billing
							</th>
							<th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
								Status
							</th>
							<th class="relative px-3 md:px-6 py-3 min-w-[100px]">
								<span class="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each data.plans as plan}
							<tr class="hover:bg-gray-50">
								<td class="px-3 md:px-6 py-4">
									<div>
										<div class="text-sm font-medium text-gray-900 break-words">{plan.name}</div>
										<div class="text-xs md:text-sm text-gray-500 break-words line-clamp-2">{plan.description}</div>
									</div>
								</td>
								<td class="px-3 md:px-6 py-4 whitespace-nowrap">
									<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {plan.type === 'subscription' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
										<span class="hidden sm:inline">{formatPlanType(plan)}</span>
										<span class="sm:hidden">{plan.type === 'subscription' ? 'Sub' : 'Project'}</span>
									</span>
								</td>
								<td class="px-3 md:px-6 py-4 whitespace-nowrap">
									<div class="text-xs md:text-sm font-medium text-gray-900">{formatPrice(plan)}</div>
								</td>
								<td class="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
									<div class="text-xs md:text-sm text-gray-900">{formatBilling(plan)}</div>
								</td>
								<td class="px-3 md:px-6 py-4 whitespace-nowrap">
									{#if plan.is_active}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
											<span class="hidden sm:inline">Active</span>
											<span class="sm:hidden">✓</span>
										</span>
									{:else}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											<span class="hidden sm:inline">Inactive</span>
											<span class="sm:hidden">✗</span>
										</span>
									{/if}
								</td>
								<td class="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<form method="POST" action="?/togglePlanStatus" class="inline">
										<input type="hidden" name="id" value={plan.id} />
										<input type="hidden" name="is_active" value={plan.is_active} />
										<button 
											type="submit"
											class="text-blue-600 hover:text-blue-900 text-xs md:text-sm px-2 py-1 rounded hover:bg-blue-50"
										>
											<span class="hidden md:inline">{plan.is_active ? 'Deactivate' : 'Activate'}</span>
											<span class="md:hidden">{plan.is_active ? 'Off' : 'On'}</span>
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<div class="text-center py-12">
					<div class="mx-auto h-12 w-12 text-gray-400">
						<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No plans found</h3>
					<p class="mt-1 text-sm text-gray-500">
						Get started by creating your first subscription plan.
					</p>
					<div class="mt-6">
						<button 
							type="button"
							on:click={scrollToForm}
							class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Add Plan
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Quick Add Plan Form -->
	<div id="quick-add-form" class="mt-8 bg-white shadow rounded-lg">
		<div class="px-6 py-4 border-b border-gray-200">
			<h2 class="text-lg font-medium text-gray-900">Quick Add Plan</h2>
		</div>
		<div class="px-6 py-4">
			<form method="POST" action="?/createPlan" class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
				<!-- Plan Type Selector -->
				<div class="sm:col-span-2">
					<label for="type" class="block text-sm font-medium text-gray-700">Plan Type</label>
					<select 
						name="type" 
						id="type" 
						bind:value={selectedPlanType}
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					>
						<option value="subscription">Subscription Plan</option>
						<option value="one_time_project">One-Time Project</option>
					</select>
				</div>

				<div>
					<label for="name" class="block text-sm font-medium text-gray-700">Plan Name</label>
					<input 
						type="text" 
						name="name" 
						id="name" 
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder={selectedPlanType === 'subscription' ? 'Essential Care' : 'Essential Online Presence'}
					/>
				</div>
				
				<!-- Conditional Fields Based on Plan Type -->
				{#if selectedPlanType === 'subscription'}
					<div>
						<label for="price" class="block text-sm font-medium text-gray-700">Price</label>
						<div class="mt-1 relative rounded-md shadow-sm">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span class="text-gray-500 sm:text-sm">$</span>
							</div>
							<input 
								type="number"
								name="price"
								id="price"
								step="0.01"
								required
								class="mt-1 block w-full px-5 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="49.00"
							/>
						</div>
					</div>
					
					<div class="sm:col-span-2">
						<label for="billing_period" class="block text-sm font-medium text-gray-700">Billing Period</label>
						<select 
							name="billing_period" 
							id="billing_period" 
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						>
							<option value="monthly">Monthly</option>
							<option value="yearly">Yearly</option>
						</select>
					</div>
				{:else}
					<div>
						<label for="price_min" class="block text-sm font-medium text-gray-700">Minimum Price</label>
						<div class="mt-1 relative rounded-md shadow-sm">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span class="text-gray-500 sm:text-sm">$</span>
							</div>
							<input 
								type="number"
								name="price_min"
								id="price_min"
								step="0.01"
								required
								class="mt-1 block w-full px-5 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="800.00"
							/>
						</div>
					</div>

					<div>
						<label for="price_max" class="block text-sm font-medium text-gray-700">Maximum Price</label>
						<div class="mt-1 relative rounded-md shadow-sm">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span class="text-gray-500 sm:text-sm">$</span>
							</div>
							<input 
								type="number"
								name="price_max"
								id="price_max"
								step="0.01"
								required
								class="mt-1 block w-full px-5 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="1500.00"
							/>
						</div>
					</div>
				{/if}
				
				<div class="sm:col-span-2">
					<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
					<textarea 
						name="description" 
						id="description" 
						rows="3"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder={selectedPlanType === 'subscription' ? 'Brief description of what this plan includes...' : 'Brief description of this project type...'}
					></textarea>
				</div>

				<!-- Features Field -->
				<div class="sm:col-span-2">
					<label for="features" class="block text-sm font-medium text-gray-700">
						Features
						{#if selectedPlanType === 'one_time_project'}
							<span class="text-xs text-gray-500">(one per line)</span>
						{:else}
							<span class="text-xs text-gray-500">(JSON format)</span>
						{/if}
					</label>
					<textarea 
						name="features" 
						id="features" 
						rows="4"
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder={selectedPlanType === 'subscription' ? '{"max_projects": 5, "support_level": "basic"}' : 'Custom website design\nResponsive mobile layout\nBasic SEO setup\nContact form integration'}
					></textarea>
				</div>
				
				<div class="flex items-center">
					<input 
						type="checkbox" 
						name="is_active" 
						id="is_active" 
						checked
						class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
					/>
					<label for="is_active" class="ml-2 block text-sm text-gray-900">
						Plan is active
					</label>
				</div>
				
				<div class="sm:col-span-2">
					<button 
						type="submit"
						class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Create {selectedPlanType === 'subscription' ? 'Subscription Plan' : 'One-Time Project'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div> 