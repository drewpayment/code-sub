<script lang="ts">
	import { ContactForm } from '$lib/components';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';

	export let form: ActionData;

	// Extract source and plan from URL parameters
	$: source = $page.url.searchParams.get('source') || '';
	$: plan = $page.url.searchParams.get('plan') || '';
</script>

<svelte:head>
  <title>Contact Us - Code-Sub</title>
  <meta name="description" content="Contact Code-Sub for professional web development services." />
</svelte:head>

<div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full">
        <div class="text-center mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
            <p class="text-gray-600">We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.</p>
        </div>

        <ContactForm {form} {source} {plan} />
    </div>
</div> 