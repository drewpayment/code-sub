<script lang="ts">
	import { ProcessStep } from '$lib/components';
	// import Search from 'lucide-svelte/icons/search';
	// import Palette from 'lucide-svelte/icons/palette';
	// import Code from 'lucide-svelte/icons/code';
	// import Rocket from 'lucide-svelte/icons/rocket';
	// import BarChart from 'lucide-svelte/icons/bar-chart';
	import Check from '$lib/components/Check.svelte'; // Using placeholder

	const processSteps = [
		{
			icon: Check, // Placeholder
			title: 'Discovery & Consultation',
			description:
				'We start by understanding your business, goals, and target audience. This includes a deep dive into your brand and requirements.'
		},
		{
			icon: Check, // Placeholder
			title: 'Strategy & Design',
			description:
				"We craft a custom design and strategy based on our discovery session. You'll receive mockups and a clear plan for your website's structure and user experience."
		},
		{
			icon: Check, // Placeholder
			title: 'Development & Implementation',
			description:
				'Our team brings the design to life, building a fast, secure, and mobile-first website with clean code and best practices.'
		},
		{
			icon: Check, // Placeholder
			title: 'Review & Launch',
			description:
				'We conduct thorough testing and invite you for a final review. Once approved, we handle the deployment and launch your new website.'
		},
		{
			icon: Check, // Placeholder
			title: 'Ongoing Support & Growth',
			description:
				'Post-launch, we offer continuous support, maintenance, and optimization services to ensure your website remains a powerful asset for your business.'
		}
	];
</script>

<svelte:head>
	<title>Our Process - CodeSub</title>
	<meta
		name="description"
		content="Discover our streamlined process for web development, from initial discovery to launch and ongoing support."
	/>
</svelte:head>

<div class="bg-gray-50 py-16 lg:py-24">
	<div class="container mx-auto px-4 max-w-3xl">
		<div class="text-center mb-16">
			<h1 class="text-4xl lg:text-5xl font-extrabold text-gray-900">Our Proven Process</h1>
			<p class="mt-4 text-lg text-gray-600">
				We follow a clear, collaborative process to ensure your project is a success from start to
				finish.
			</p>
		</div>

		<div class="relative">
			{#each processSteps as step, i}
				<ProcessStep
					icon={step.icon}
					title={step.title}
					description={step.description}
					stepNumber={i + 1}
					isLast={i === processSteps.length - 1}
				/>
			{/each}
		</div>
	</div>
</div> 