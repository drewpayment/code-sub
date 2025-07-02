<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';

	export let data: PageData;

	const handleSearch = (event: any) => {
		const formData = new FormData(event.target);
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

	const handleStatusFilter = (status: string) => {
		const url = new URL($page.url);
		
		if (status) {
			url.searchParams.set('status', status);
		} else {
			url.searchParams.delete('status');
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

	const getStatusColor = (status: string) => {
		if (status === 'active') return 'bg-green-100 text-green-800';
		if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
		if (status === 'payment_failed') return 'bg-red-100 text-red-800';
		if (status === 'terminated') return 'bg-gray-100 text-gray-800';
		if (status === 'cancelled') return 'bg-gray-100 text-gray-800';
		return 'bg-gray-100 text-gray-800';
	}
</script>

<svelte:head>
	<title>Subscription Overview - Admin Dashboard</title>
</svelte:head>

<!-- Header with stats -->
<div class="bg-white shadow rounded-lg mb-6">
	<div class="px-6 py-4 border-b border-gray-200">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h3 class="text-lg font-medium text-gray-900">Subscription Overview</h3>
				<p class="mt-1 text-sm text-gray-500">
					{data.pagination.totalItems} total subscriptions
				</p>
			</div>
			<div class="mt-4 sm:mt-0">
				<form on:submit|preventDefault={handleSearch} class="flex space-x-4">
					<div class="min-w-0 flex-1">
						<label for="search" class="sr-only">Search subscriptions</label>
						<input
							type="text"
							name="search"
							id="search"
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Search by customer or plan..."
							value={data.filters.search}
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

<!-- Stats Cards -->
<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
	<div class="bg-white overflow-hidden shadow rounded-lg">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
						</svg>
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
						<dd class="text-lg font-medium text-gray-900">{data.stats.total_customers}</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-white overflow-hidden shadow rounded-lg">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="text-sm font-medium text-gray-500 truncate">Active Subscriptions</dt>
						<dd class="text-lg font-medium text-gray-900">{data.stats.active_subscriptions}</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-white overflow-hidden shadow rounded-lg">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="text-sm font-medium text-gray-500 truncate">Pending Subscriptions</dt>
						<dd class="text-lg font-medium text-gray-900">{data.stats.pending_subscriptions}</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-white overflow-hidden shadow rounded-lg">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
						</svg>
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
						<dd class="text-lg font-medium text-gray-900">${data.stats.monthly_revenue}</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Status Filter Tabs -->
<div class="bg-white shadow rounded-lg mb-6">
	<div class="border-b border-gray-200">
		<nav class="flex space-x-8 px-6" aria-label="Tabs">
			<button
				type="button"
				on:click={() => handleStatusFilter('')}
				class="py-4 px-1 border-b-2 font-medium text-sm {data.filters.status === '' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				All Subscriptions
			</button>
			<button
				type="button"
				on:click={() => handleStatusFilter('active')}
				class="py-4 px-1 border-b-2 font-medium text-sm {data.filters.status === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				Active
			</button>
			<button
				type="button"
				on:click={() => handleStatusFilter('pending')}
				class="py-4 px-1 border-b-2 font-medium text-sm {data.filters.status === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				Pending
			</button>
			<button
				type="button"
				on:click={() => handleStatusFilter('payment_failed')}
				class="py-4 px-1 border-b-2 font-medium text-sm {data.filters.status === 'payment_failed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
			>
				Payment Failed
			</button>
		</nav>
	</div>
</div>

<!-- Subscriptions Table -->
<div class="bg-white shadow rounded-lg">
	<div class="overflow-hidden">
		{#if data.subscriptions.length > 0}
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Customer
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Plan
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Start Date
						</th>
						<th class="relative px-6 py-3">
							<span class="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each data.subscriptions as subscription}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="h-10 w-10 flex-shrink-0">
										<div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
											<span class="text-sm font-medium text-gray-700">
												{(subscription.expand?.customer_id?.name || subscription.expand?.customer_id?.email || '').charAt(0).toUpperCase()}
											</span>
										</div>
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">
											{subscription.expand?.customer_id?.name || 'No name set'}
										</div>
										<div class="text-sm text-gray-500">
											{subscription.expand?.customer_id?.email}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">
									{subscription.expand?.plan_id?.name || 'Unknown Plan'}
								</div>
								<div class="text-sm text-gray-500">
									${subscription.expand?.plan_id?.price || 0}/month
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(subscription.status)}">
									{subscription.status.replace('_', ' ')}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{subscription.start_date ? formatDate(subscription.start_date) : 'Not started'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<div class="flex justify-end space-x-2">
									<a
										href="/admin/customers/{subscription.expand?.customer_id?.id}"
										class="text-blue-600 hover:text-blue-900"
									>
										Manage
									</a>
									{#if subscription.expand?.customer_id?.stripe_customer_id}
										<span class="text-gray-300">|</span>
										<a
											href="/admin/customers/{subscription.expand?.customer_id?.id}/billing"
											class="text-green-600 hover:text-green-900"
										>
											Billing
										</a>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<div class="text-center py-12">
				<div class="mx-auto h-12 w-12 text-gray-400">
					<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</div>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No subscriptions found</h3>
				<p class="mt-1 text-sm text-gray-500">
					{data.filters.search || data.filters.status ? 'Try adjusting your search or filter.' : 'No subscriptions have been created yet.'}
				</p>
			</div>
		{/if}
	</div>

	{#if data.pagination.totalPages > 1}
		<div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
			<div class="flex-1 flex justify-between sm:hidden">
				{#if data.pagination.page > 1}
					<a
						href="?page={data.pagination.page - 1}{data.filters.search ? `&search=${data.filters.search}` : ''}{data.filters.status ? `&status=${data.filters.status}` : ''}"
						class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
					>
						Previous
					</a>
				{/if}
				{#if data.pagination.page < data.pagination.totalPages}
					<a
						href="?page={data.pagination.page + 1}{data.filters.search ? `&search=${data.filters.search}` : ''}{data.filters.status ? `&status=${data.filters.status}` : ''}"
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