<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data: any;
	export let form: any;

	let showCreateForm = false;

	const handleSearch = (event: Event) => {
    const formData = new FormData(event.target as HTMLFormElement);
		const search = formData.get('search') as string;
		const url = new URL($page.url);
		
		if (search) {
			url.searchParams.set('search', search);
		} else {
			url.searchParams.delete('search');
		}
		url.searchParams.delete('page');
		
		goto(url.toString());
  }

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const getRoleColor = (role: string) => {
		if (role === 'super_admin') return 'bg-purple-100 text-purple-800';
		if (role === 'admin') return 'bg-red-100 text-red-800';
		if (role === 'manager') return 'bg-orange-100 text-orange-800';
		if (role === 'employee') return 'bg-blue-100 text-blue-800';
		return 'bg-gray-100 text-gray-800';
	}
</script>

<svelte:head>
	<title>Customer Management - Admin Dashboard</title>
</svelte:head>

<!-- Header with Add Customer button -->
<div class="bg-white shadow rounded-lg mb-6">
	<div class="px-6 py-4 border-b border-gray-200">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h3 class="text-lg font-medium text-gray-900">Customers</h3>
				<p class="mt-1 text-sm text-gray-500">
					{data.pagination.totalItems} total customers
				</p>
			</div>
			<div class="mt-4 sm:mt-0 flex space-x-4">
				<button
					type="button"
					on:click={() => showCreateForm = !showCreateForm}
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
				>
					{showCreateForm ? 'Cancel' : 'Add Customer'}
				</button>
				<form on:submit|preventDefault={handleSearch} class="flex space-x-4">
					<div class="min-w-0 flex-1">
						<label for="search" class="sr-only">Search customers</label>
						<input
							type="text"
							name="search"
							id="search"
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Search customers by name or email..."
							value={data.search}
						/>
					</div>
					<button
						type="submit"
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Search
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

<!-- Create Customer Form -->
{#if showCreateForm}
	<div class="bg-white shadow rounded-lg mb-6">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-medium text-gray-900">Create New Customer</h3>
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

			<form method="POST" action="?/createCustomer" class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email Address *</label>
					<input 
						type="email" 
						name="email" 
						id="email" 
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						placeholder="customer@example.com"
					/>
				</div>
				
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
					<input 
						type="text" 
						name="name" 
						id="name"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						placeholder="John Doe"
					/>
				</div>
				
				<div>
					<label for="role" class="block text-sm font-medium text-gray-700">Customer Type</label>
					<select 
						name="role" 
						id="role"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
					>
						<option value="customer" selected>Customer</option>
					</select>
					<p class="mt-1 text-xs text-gray-500">All users created here will be customers. Use a different interface for admin users.</p>
				</div>
				
				<div class="sm:col-span-2">
					<p class="text-sm text-gray-500">
						The customer will be created with a temporary password and will need to reset it on first login. They will have customer-level access only.
					</p>
				</div>
				
				<div class="sm:col-span-2">
					<button 
						type="submit"
						class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Create Customer
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<div class="bg-white shadow rounded-lg">
	<div class="overflow-hidden">
		{#if data.customers.length > 0}
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Customer
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Verified
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Joined
						</th>
						<th class="relative px-6 py-3">
							<span class="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each data.customers as customer}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="h-10 w-10 flex-shrink-0">
										{#if customer.avatar}
											<img class="h-10 w-10 rounded-full" src={customer.avatar} alt="" />
										{:else}
											<div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
												<span class="text-sm font-medium text-gray-700">
													{(customer.name || customer.email || '').charAt(0).toUpperCase()}
												</span>
											</div>
										{/if}
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">
											{customer.name || 'No name set'}
										</div>
										<div class="text-sm text-gray-500">
											{customer.email}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								{#if customer.verified}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
										Verified
									</span>
								{:else}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
										Unverified
									</span>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{formatDate(customer.created)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<a
									href="/admin/customers/{customer.id}"
									class="text-blue-600 hover:text-blue-900"
								>
									Manage
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<div class="text-center py-12">
				<div class="mx-auto h-12 w-12 text-gray-400">
					<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
					</svg>
				</div>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
				<p class="mt-1 text-sm text-gray-500">
					{data.search ? 'Try adjusting your search terms.' : 'Get started by creating customer accounts.'}
				</p>
			</div>
		{/if}
	</div>

	{#if data.pagination.totalPages > 1}
		<div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
			<div class="flex-1 flex justify-between sm:hidden">
				{#if data.pagination.page > 1}
					<a
						href="?page={data.pagination.page - 1}{data.search ? `&search=${data.search}` : ''}"
						class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
					>
						Previous
					</a>
				{/if}
				{#if data.pagination.page < data.pagination.totalPages}
					<a
						href="?page={data.pagination.page + 1}{data.search ? `&search=${data.search}` : ''}"
						class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
					>
						Next
					</a>
				{/if}
			</div>
			<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
				<div>
					<p class="text-sm text-gray-700">
						Showing
						<span class="font-medium">{(data.pagination.page - 1) * data.pagination.perPage + 1}</span>
						to
						<span class="font-medium">{Math.min(data.pagination.page * data.pagination.perPage, data.pagination.totalItems)}</span>
						of
						<span class="font-medium">{data.pagination.totalItems}</span>
						results
					</p>
				</div>
			</div>
		</div>
	{/if}
</div> 