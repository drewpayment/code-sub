<script lang="ts">
	
	interface Props {
		/**
		 * Additional CSS classes
		 */
		class?: string;
	}

	let {
		class: className = ''
	}: Props = $props();

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

<header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 {className}">
	<div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
		<div class="flex items-center justify-between h-16">
			<!-- Logo/Brand -->
			<div class="flex-shrink-0">
				<a href="/" class="flex items-center">
					<div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-lg">C</span>
					</div>
					<span class="ml-2 text-xl font-bold text-gray-900 hidden sm:block">Code-Sub</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex space-x-8">
				{#each navItems as item}
					<a 
						href={item.href}
						class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- Desktop CTA -->
			<div class="hidden md:flex items-center space-x-4">
				<a 
					href="/contact" 
					class="btn btn-primary px-4 py-2 text-sm"
				>
					Get Started
				</a>
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

		<!-- Mobile Navigation Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden transition-all duration-300 ease-in-out">
				<div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 mt-2 bg-white shadow-lg">
					{#each navItems as item}
						<a
							href={item.href}
							onclick={closeMobileMenu}
							class="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200"
						>
							{item.label}
						</a>
					{/each}
					
					<!-- Mobile CTA -->
					<div class="pt-4 pb-2">
						<a 
							href="/contact"
							onclick={closeMobileMenu}
							class="btn btn-primary w-full text-center block px-3 py-2 text-base font-medium"
						>
							Get Started
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</header>

<style>
	/* Ensure mobile menu animates smoothly */
	header {
		transition: all 0.3s ease-in-out;
	}
</style> 