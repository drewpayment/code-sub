<script>
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	let sidebarOpen = false;
	let isMobile = false;

	onMount(() => {
		// Check if mobile on mount
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
			// On desktop, keep sidebar open by default
			if (!isMobile && !sidebarOpen) {
				sidebarOpen = true;
			}
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	async function handleLogout() {
		pb.authStore.clear();
		await goto('/login');
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		if (isMobile) {
			sidebarOpen = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Code-Sub</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Mobile sidebar overlay -->
	{#if sidebarOpen && isMobile}
		<div 
			class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" 
			on:click={closeSidebar}
			on:keydown={(e) => e.key === 'Escape' && closeSidebar()}
			role="button"
			tabindex="0"
		></div>
	{/if}

	<!-- Sidebar -->
	<div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
		<!-- Logo -->
		<div class="flex h-16 items-center justify-center border-b border-gray-200">
			<h1 class="text-xl font-bold text-gray-900">Code-Sub Admin</h1>
		</div>

		<!-- Navigation -->
		<nav class="mt-6 px-4">
			<ul class="space-y-2">
				<li>
					<a
						href="/admin"
						on:click={closeSidebar}
						class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname === '/admin' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
					>
						<span class="mr-3 text-lg">📊</span>
						Dashboard
					</a>
				</li>
				<li>
					<a
						href="/admin/customers"
						on:click={closeSidebar}
						class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname === '/admin/customers' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
					>
						<span class="mr-3 text-lg">👥</span>
						Customers
					</a>
				</li>
				<li>
					<a
						href="/admin/subscriptions"
						on:click={closeSidebar}
						class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname === '/admin/subscriptions' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
					>
						<span class="mr-3 text-lg">📋</span>
						Subscriptions
					</a>
				</li>
				<li>
					<a
						href="/admin/plans"
						on:click={closeSidebar}
						class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname === '/admin/plans' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
					>
						<span class="mr-3 text-lg">💼</span>
						Plans
					</a>
				</li>
			</ul>
		</nav>

		<!-- User info & logout -->
		<div class="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
						<span class="text-white text-sm font-medium">
							{data.user?.name?.charAt(0)?.toUpperCase() || data.user?.email?.charAt(0)?.toUpperCase()}
						</span>
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-medium text-gray-900 truncate">
							{data.user?.name || 'Admin'}
						</p>
						<p class="text-xs text-gray-500 capitalize">{data.user?.role}</p>
					</div>
				</div>
				<button 
					on:click={handleLogout}
					class="text-gray-400 hover:text-gray-600 p-1 rounded"
					title="Logout"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Main content -->
	<div class="transition-all duration-200 ease-in-out {sidebarOpen ? 'pl-64' : 'pl-0'}">
		<!-- Top bar -->
		<header class="bg-white shadow-sm border-b border-gray-200">
			<div class="px-4 md:px-6 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-4">
						<!-- Hamburger menu button -->
						<button
							on:click={toggleSidebar}
							class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							aria-label="Toggle sidebar"
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
						
						<div>
							<h1 class="text-xl md:text-2xl font-semibold text-gray-900">
								{#if $page.url.pathname === '/admin'}
									Dashboard
								{:else if $page.url.pathname === '/admin/customers'}
									Customer Management
								{:else if $page.url.pathname === '/admin/subscriptions'}
									Subscription Management
								{:else if $page.url.pathname === '/admin/plans'}
									Plan Management
								{:else}
									Admin
								{/if}
							</h1>
							<p class="text-sm text-gray-600 hidden md:block">
								Manage your customers, subscriptions, and billing plans
							</p>
						</div>
					</div>
					
					<div class="flex items-center space-x-4">
						<a 
							href="/"
							class="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							<span class="hidden md:inline">Back to site</span>
						</a>
					</div>
				</div>
			</div>
		</header>

		<main class="p-4 md:p-6">
			<slot />
		</main>
	</div>
</div> 