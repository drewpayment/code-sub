<script lang="ts">
	import { Container } from '$lib';
	import { page } from '$app/stores';
	import { currentUser } from '$lib/pocketbase';

	const navLinks = [
		{ href: '/services', text: 'Services' },
		{ href: '/about', text: 'About' },
		{ href: '/process', text: 'Process' },
		{ href: '/pricing', text: 'Pricing' },
		{ href: '/contact', text: 'Contact' },
	];

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/services', label: 'Services' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	// Toggle mobile menu
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Close mobile menu when clicking on a link
	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	// Close mobile menu when clicking outside (mobile UX improvement)
	function handleClickOutside(event: Event) {
		const target = event.target as HTMLElement;
		if (mobileMenuOpen && !target.closest('header')) {
			mobileMenuOpen = false;
		}
	}
</script>

<header class="bg-white shadow-md sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16 relative">
			<!-- Logo -->
			<a href="/" class="text-2xl font-bold text-gray-900">
				Code<span class="text-blue-600">Sub</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 space-x-6">
				{#each navLinks as link}
					<a 
						href={link.href} 
						class="transition-colors"
						class:text-blue-600={$page.url.pathname === link.href}
						class:text-gray-600={$page.url.pathname !== link.href}
						class:hover:text-blue-600={$page.url.pathname !== link.href}
					>
						{link.text}
					</a>
				{/each}
			</nav>

			<!-- Account & CTA -->
			<div class="hidden md:flex items-center space-x-4">
				{#if $currentUser}
					<span class="text-gray-600 text-sm">Welcome, {$currentUser.name || $currentUser.email}</span>
					<!-- Show admin link for admin users -->
					{#if $currentUser.role && ['admin', 'super_admin', 'manager', 'employee'].includes($currentUser.role)}
						<a
							href="/admin"
							class="transition-colors"
							class:text-blue-600={$page.url.pathname.startsWith('/admin')}
							class:text-gray-600={!$page.url.pathname.startsWith('/admin')}
							class:hover:text-blue-600={!$page.url.pathname.startsWith('/admin')}
						>
							Admin
						</a>
					{/if}
					<a
						href="/account"
						class="transition-colors"
						class:text-blue-600={$page.url.pathname === '/account'}
						class:text-gray-600={$page.url.pathname !== '/account'}
						class:hover:text-blue-600={$page.url.pathname !== '/account'}
					>
						Account
					</a>
					<form method="POST" action="/logout" class="inline">
						<button type="submit" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">
							Logout
						</button>
					</form>
				{:else}
					<a
						href="/login"
						class="transition-colors"
						class:text-blue-600={$page.url.pathname === '/login'}
						class:text-gray-600={$page.url.pathname !== '/login'}
						class:hover:text-blue-600={$page.url.pathname !== '/login'}
					>
						Sign In
					</a>
					<a href="/contact" class="btn btn-primary px-4 py-2 text-sm">
						Get a Quote
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={toggleMobileMenu}
					class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
					aria-expanded={mobileMenuOpen}
					aria-label="Toggle navigation menu"
				>
					<!-- Hamburger icon -->
					<svg 
						class="h-6 w-6 {mobileMenuOpen ? 'hidden' : 'block'}" 
						fill="none" 
						viewBox="0 0 24 24" 
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
					<!-- X icon -->
					<svg 
						class="h-6 w-6 {mobileMenuOpen ? 'block' : 'hidden'}" 
						fill="none" 
						viewBox="0 0 24 24" 
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation Menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				{#each navLinks as link}
					<a 
						href={link.href} 
						onclick={() => mobileMenuOpen = false} 
						class="block px-3 py-2 rounded-md text-base font-medium"
						class:bg-blue-50={$page.url.pathname === link.href}
						class:text-blue-700={$page.url.pathname === link.href}
						class:text-gray-700={$page.url.pathname !== link.href}
						class:hover:text-gray-900={$page.url.pathname !== link.href}
						class:hover:bg-gray-50={$page.url.pathname !== link.href}
					>{link.text}</a>
				{/each}
			</div>
			<div class="pt-4 pb-3 border-t border-gray-200">
				<div class="px-5 space-y-2">
					{#if $currentUser}
						<div class="pb-3">
							<div class="text-base font-medium text-gray-800">{$currentUser.name || $currentUser.email}</div>
							<div class="text-sm font-medium text-gray-500">{$currentUser.email}</div>
						</div>
						
						<!-- Admin link for mobile -->
						{#if $currentUser.role && ['admin', 'super_admin', 'manager', 'employee'].includes($currentUser.role)}
							<a 
								href="/admin" 
								onclick={() => mobileMenuOpen = false} 
								class="block px-3 py-2 rounded-md text-base font-medium"
								class:bg-blue-50={$page.url.pathname.startsWith('/admin')}
								class:text-blue-700={$page.url.pathname.startsWith('/admin')}
								class:text-gray-700={!$page.url.pathname.startsWith('/admin')}
								class:hover:text-gray-900={!$page.url.pathname.startsWith('/admin')}
								class:hover:bg-gray-50={!$page.url.pathname.startsWith('/admin')}
							>Admin Dashboard</a>
						{/if}
						
						<a 
							href="/account" 
							onclick={() => mobileMenuOpen = false} 
							class="block px-3 py-2 rounded-md text-base font-medium"
							class:bg-blue-50={$page.url.pathname === '/account'}
							class:text-blue-700={$page.url.pathname === '/account'}
							class:text-gray-700={$page.url.pathname !== '/account'}
							class:hover:text-gray-900={$page.url.pathname !== '/account'}
							class:hover:bg-gray-50={$page.url.pathname !== '/account'}
						>Account</a>
						
						<form method="POST" action="/logout" class="block w-full">
							<button type="submit" class="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">
								Logout
							</button>
						</form>
					{:else}
						<a 
							href="/login" 
							onclick={() => mobileMenuOpen = false} 
							class="flex-grow text-base font-medium p-2 rounded-md"
							class:bg-blue-50={$page.url.pathname === '/login'}
							class:text-blue-700={$page.url.pathname === '/login'}
							class:text-gray-700={$page.url.pathname !== '/login'}
							class:hover:text-gray-900={$page.url.pathname !== '/login'}
							class:hover:bg-gray-50={$page.url.pathname !== '/login'}
						>Sign In</a>
						<a href="/contact" onclick={() => mobileMenuOpen = false} class="ml-4 btn btn-primary w-full">Get a Quote</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</header>

<style>
	/* Ensure mobile menu animates smoothly */
	header {
		transition: all 0.3s ease-in-out;
	}
</style> 