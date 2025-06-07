<script lang="ts">
	import '../app.css';
	import { Header, Footer } from '$lib';

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<Header />
	<main class="px-4 sm:px-6 lg:px-8 flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
