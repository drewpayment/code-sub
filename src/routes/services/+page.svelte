<script lang="ts">
	import { ServiceCard } from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;

	const oneTimeTiers = [
		{
			title: 'Essential Online Presence',
			priceRange: '$800 - $1,500 (One-time fee)',
			idealFor: 'Businesses needing a solid, professional online brochure.',
			features: [
				'Custom design based on client\'s branding',
				'Up to 5 core sections',
				'Mobile-responsive layout',
				'Basic SEO setup',
				'Functional lead capture contact form',
				'1 LLM-powered feature',
				'1 round of design revisions'
			]
		},
		{
			title: 'Enhanced Marketing Hub',
			priceRange: '$1,500 - $2,500 (One-time fee)',
			idealFor: 'Businesses looking for a more comprehensive and engaging digital presence.',
			features: [
				'Everything in Essential',
				'Up to 7-8 core sections',
				'Professional copywriting assistance',
				'Optimized image compression',
				'Subtle animations and enhanced UI/UX',
				'Integration of multiple LLM-powered features',
				'2-3 rounds of design revisions'
			]
		},
		{
			title: 'Premium Digital Showcase',
			priceRange: '$2,500 - $5,000+ (One-time fee)',
			idealFor: 'Businesses that want a top-tier, custom-tailored static site.',
			features: [
				'Everything in Enhanced',
				'Unlimited sections',
				'Full professional copywriting services',
				'Custom iconography and graphic design',
				'Advanced on-page SEO optimization',
				'Custom-built LLM feature',
				'Unlimited design revisions'
			]
		}
	];

	const recurringServices = [
		{
			title: 'Essential Care',
			priceRange: '$49/month',
			idealFor: 'Reliable hosting and core maintenance for a secure online presence.',
			features: [
				'Website hosting & uptime monitoring',
				'SSL certificate management',
				'Regular security updates',
				'Monthly backups',
				'Basic tech stack updates',
				'Email support'
			]
		},
		{
			title: 'Professional Care',
			priceRange: '$99/month',
			idealFor: 'Proactive support and optimization for growing businesses.',
			features: [
				'Everything in Essential Care',
				'Content updates (2 hours/month)',
				'Performance monitoring & optimization',
				'Basic SEO health checks',
				'Google Analytics setup',
				'Priority email support'
			]
		},
		{
			title: 'Premium Care',
			priceRange: '$199/month',
			idealFor: 'Comprehensive support and strategic insights for established businesses.',
			features: [
				'Everything in Professional Care',
				'Extended content updates (4 hours/month)',
				'Monthly performance reports',
				'Advanced SEO optimization',
				'Emergency response (4hr)',
				'Phone support'
			]
		}
	];
</script>

<svelte:head>
	<title>Our Services - CodeSub</title>
	<meta
		name="description"
		content="Explore our professional web development packages, from essential websites to premium digital showcases with AI integration."
	/>
</svelte:head>

<div class="py-16 lg:py-24 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h1 class="text-4xl lg:text-5xl font-extrabold text-gray-900">Our Services</h1>
			<p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
				We build high-performance websites tailored to your business needs. Explore our packages below.
			</p>
		</div>

		<!-- One-Time Projects -->
		<section>
			<h2 class="text-3xl font-bold text-center mb-10">One-Time Projects</h2>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each oneTimeTiers as tier}
					<ServiceCard
						title={tier.title}
						priceRange={tier.priceRange}
						idealFor={tier.idealFor}
						features={tier.features}
					/>
				{/each}
			</div>
		</section>

		<!-- Recurring Services -->
		<section class="mt-20">
			<h2 class="text-3xl font-bold text-center mb-10">Ongoing Support & Growth</h2>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each recurringServices as service}
					<ServiceCard
						title={service.title}
						priceRange={service.priceRange}
						idealFor={service.idealFor}
						features={service.features}
					/>
				{/each}
			</div>
		</section>

		<!-- Call to Action Section -->
		<section class="mt-20 text-center bg-white p-10 rounded-xl shadow-lg">
			<h2 class="text-3xl font-bold text-gray-900">Ready to Start Your Project?</h2>
			<p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
				Have questions or need a custom quote? We're here to help you figure out the best solution
				for your business.
			</p>
			<div class="mt-8">
				<a href="/contact?source=services" class="btn btn-primary px-8 py-3 text-lg">
					Get a Free Quote
				</a>
			</div>
		</section>
	</div>
</div> 