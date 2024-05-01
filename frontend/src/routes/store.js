import { get, writable } from "svelte/store";
import { goto } from "$app/navigation";

export const socket = writable();
export const settings = writable();

export const currentBot = writable();

currentBot.subscribe((name) => {
	if (!name) return;
	console.log(name);
	get(socket).emit("selectBot", name);

	goto("/control-interface");
});
