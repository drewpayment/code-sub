import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('https://pocketbase.hoytlabs.cloud');

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model);
}); 