<script lang="ts">
	import { page } from '$app/stores';
	import { CheckCircle } from 'lucide-svelte';

	let title = 'Thank You!';
	let message = "Your message has been sent successfully. We'll get back to you as soon as possible.";

	const source = $page.url.searchParams.get('source');
	const plan = $page.url.searchParams.get('plan');

	if (source === 'pricing' && plan) {
		title = `You're on your way!`;
		message = `Thanks for choosing the ${plan
			.split('-')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(
				' '
			)} plan. We'll be in touch shortly to get you set up and started.`;
	} else if (source === 'services') {
		title = 'Quote Request Received!';
		message =
			"We've received your request for a quote. Our team will review your project needs and get back to you with a detailed estimate soon.";
	}
</script>

<svelte:head>
	<title>Submission Received - CodeSub</title>
	<meta name="description" content="Thank you for your submission." />
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 py-12 px-4">
	<div class="mx-auto w-full max-w-md text-center">
		<CheckCircle class="mx-auto h-16 w-16 text-green-500" />
		<h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
			{title}
		</h1>
		<p class="mt-4 text-lg leading-7 text-gray-600">
			{message}
		</p>
		<div class="mt-10">
			<a
				href="/"
				class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
				>Go back home</a
			>
		</div>
	</div>
</div> 