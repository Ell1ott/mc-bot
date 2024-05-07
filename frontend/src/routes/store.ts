import { get, writable } from 'svelte/store';
import { goto } from '$app/navigation';
import type { Socket } from 'socket.io-client';

export const socket = writable<Socket>();
export const settings = writable();

export const currentBot = writable();

currentBot.subscribe((name) => {
	if (!name) return;
	console.log(name);
	goto('/control-interface');
});
