<script lang="ts">
	import type { PageData } from './$types';
	import type { Subscription } from '$lib/types/subscription';

	export let data: PageData;

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			case 'suspended':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Code-Sub</title>
</svelte:head>

<!-- Stats Overview -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
	<!-- Total Customers -->
	<div class="bg-white overflow-hidden shadow rounded-lg">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
						<span class="text-white text-lg">👥</span>
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

	<!-- Active Subscriptions -->
	<div class="bg-white overflow-hidden shadow rounded-lg">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
						<span class="text-white text-lg">✅</span>
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

	<!-- Pending Subscriptions -->
	<div class="bg-white overflow-hidden shadow rounded-lg">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
						<span class="text-white text-lg">⏳</span>
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

	<!-- Monthly Revenue -->
	<div class="bg-white overflow-hidden shadow rounded-lg">
		<div class="p-5">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
						<span class="text-white text-lg">💰</span>
					</div>
				</div>
				<div class="ml-5 w-0 flex-1">
					<dl>
						<dt class="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
						<dd class="text-lg font-medium text-gray-900">{formatCurrency(data.stats.monthly_revenue)}</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Stripe Metrics Section -->
<div class="mb-8">
	<h3 class="text-lg font-medium text-gray-900 mb-4">Payment & Billing Metrics</h3>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Overdue Subscriptions -->
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
							<span class="text-white text-lg">⚠️</span>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Past Due Subscriptions</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.past_due_subscriptions}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<!-- Cancelled Subscriptions -->
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
							<span class="text-white text-lg">❌</span>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Cancelled Subscriptions</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.cancelled_subscriptions}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<!-- Stripe MRR -->
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
							<span class="text-white text-lg">📊</span>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Stripe MRR</dt>
							<dd class="text-lg font-medium text-gray-900">{formatCurrency(data.stats.stripe_mrr)}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<!-- Failed Payments This Month -->
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
							<span class="text-white text-lg">💳</span>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Failed Payments (Month)</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.failed_payments_this_month}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Quick Actions -->
<div class="bg-white shadow rounded-lg mb-8">
	<div class="px-6 py-4 border-b border-gray-200">
		<h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
	</div>
	<div class="p-6">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<a
				href="/admin/customers"
				class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				<span class="mr-2">👥</span>
				View All Customers
			</a>
			<a
				href="/admin/subscriptions"
				class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				<span class="mr-2">📋</span>
				Manage Subscriptions
			</a>
			<a
				href="/admin/plans"
				class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				<span class="mr-2">💼</span>
				Manage Plans
			</a>
			<button
				type="button"
				class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				<span class="mr-2">✉️</span>
				Send Notifications
			</button>
		</div>
	</div>
</div>

<!-- Recent Activity -->
<div class="bg-white shadow rounded-lg">
	<div class="px-6 py-4 border-b border-gray-200">
		<h3 class="text-lg font-medium text-gray-900">Recent Subscription Activity</h3>
	</div>
	<div class="divide-y divide-gray-200">
		{#if data.recentSubscriptions.length > 0}
			{#each data.recentSubscriptions as subscription}
				<div class="px-6 py-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div class="flex-shrink-0">
								<div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
									<span class="text-sm font-medium text-gray-700">
										{subscription.expand?.customer_id?.name?.charAt(0)?.toUpperCase() || 
										 subscription.expand?.customer_id?.email?.charAt(0)?.toUpperCase() || '?'}
									</span>
								</div>
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-sm font-medium text-gray-900">
									{subscription.expand?.customer_id?.name || subscription.expand?.customer_id?.email || 'Unknown Customer'}
								</p>
								<p class="text-sm text-gray-500">
									{subscription.expand?.plan_id?.name || 'Unknown Plan'}
								</p>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(subscription.status)}">
								{subscription.status}
							</span>
							<span class="text-sm text-gray-500">
								{formatDate(subscription.created)}
							</span>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div class="px-6 py-8 text-center">
				<p class="text-gray-500">No recent subscription activity</p>
			</div>
		{/if}
	</div>
	<div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
		<div class="text-sm">
			<a href="/admin/subscriptions" class="font-medium text-blue-600 hover:text-blue-500">
				View all subscriptions →
			</a>
		</div>
	</div>
</div> 