<script lang="ts">
	import '../app.css';
	import { Header, Footer } from '$lib';
	import type { LayoutData } from './$types';
	import { currentUser } from '$lib/pocketbase';

	export let data: LayoutData;

	$: currentUser.set(data.user);
</script>

<svelte:head>
	<script>
		window.chatwootSettings = {"position":"right","type":"standard","launcherTitle":"Chat with us"};
		(function(d,t) {
			var BASE_URL="https://chatwoot.hoytlabs.cloud";
			var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
			g.src=BASE_URL+"/packs/js/sdk.js";
			g.defer = true;
			g.async = true;
			s.parentNode.insertBefore(g,s);
			g.onload=function(){
				window.chatwootSDK.run({
					websiteToken: '6YYzHFFuiJiJSrNJhJ6xVWtE',
					baseUrl: BASE_URL
				})
			}
		})(document,"script");
	</script>	
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Header />

	<main class="flex-1">
		<slot />
	</main>

	<Footer />
</div>
