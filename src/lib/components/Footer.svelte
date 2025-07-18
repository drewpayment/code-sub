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

	// Footer navigation sections
	const footerSections = [
		{
			title: 'Services',
			links: [
				{ href: '/services/custom-development', label: 'Custom Development' },
				{ href: '/services/responsive-design', label: 'Responsive Design' },
				{ href: '/services/performance', label: 'Performance Optimization' },
				{ href: '/services/maintenance', label: 'Maintenance & Support' }
			]
		},
		{
			title: 'Company',
			links: [
				{ href: '/about', label: 'About Us' },
				{ href: '/team', label: 'Our Team' },
				{ href: '/careers', label: 'Careers' },
				{ href: '/blog', label: 'Blog' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ href: '/docs', label: 'Documentation' },
				{ href: '/guides', label: 'Guides' },
				{ href: '/faq', label: 'FAQ' },
				{ href: '/support', label: 'Support' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ href: '/privacy-policy', label: 'Privacy Policy' },
				{ href: '/terms', label: 'Terms of Service' },
				{ href: '/cookies', label: 'Cookie Policy' },
				{ href: '/gdpr', label: 'GDPR' }
			]
		}
	];

	// Social media links
	const socialLinks = [
		{ href: 'https://github.com', label: 'GitHub', icon: 'github' },
		{ href: 'https://twitter.com', label: 'Twitter', icon: 'twitter' },
		{ href: 'https://linkedin.com', label: 'LinkedIn', icon: 'linkedin' },
		{ href: 'mailto:hello@code-sub.com', label: 'Email', icon: 'email' }
	];

	// Get current year
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gray-900 text-white {className}">
	<div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
		<!-- Main Footer Content -->
		<div class="py-12 lg:py-16">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
				<!-- Company Info -->
				<div class="col-span-1 md:col-span-2 lg:col-span-2">
					<div class="flex items-center mb-4">
						<div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<span class="text-white font-bold text-lg">C</span>
						</div>
						<span class="ml-2 text-xl font-bold text-white">Code-Sub</span>
					</div>
					<p class="text-gray-300 mb-6 max-w-md">
						Professional web development services that drive results and growth. 
						Build your online presence with our expert development team.
					</p>
					
					<!-- Social Links -->
					<div class="flex space-x-4">
						{#each socialLinks as social}
							<a 
								href={social.href}
								class="text-gray-400 hover:text-white transition-colors duration-200"
								aria-label={social.label}
								target={social.href.startsWith('http') ? '_blank' : undefined}
								rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
							>
								{#if social.icon === 'github'}
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
									</svg>
								{:else if social.icon === 'twitter'}
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								{:else if social.icon === 'linkedin'}
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd" />
									</svg>
								{:else if social.icon === 'email'}
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								{/if}
							</a>
						{/each}
					</div>
				</div>

				<!-- Footer Navigation Sections -->
				{#each footerSections as section}
					<div>
						<h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
							{section.title}
						</h3>
						<ul class="space-y-3">
							{#each section.links as link}
								<li>
									<a 
										href={link.href}
										class="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
									>
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-gray-800 py-6">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="text-gray-400 text-sm mb-4 md:mb-0">
					© {currentYear} Code-Sub. All rights reserved.
				</div>
				<div class="flex space-x-6">
					<a href="/privacy-policy" class="text-gray-400 hover:text-white text-sm transition-colors duration-200">
						Privacy
					</a>
					<a href="/terms" class="text-gray-400 hover:text-white text-sm transition-colors duration-200">
						Terms
					</a>
					<a href="/cookies" class="text-gray-400 hover:text-white text-sm transition-colors duration-200">
						Cookies
					</a>
				</div>
			</div>
		</div>
	</div>
</footer> 