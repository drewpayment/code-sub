<script lang="ts">
	import '../app.css';
	import { Header, Footer } from '$lib';
</script>

<div class="min-h-screen flex flex-col">
	<Header />

	<main class="flex-1">
		<slot />
	</main>

	<Footer />
</div>
