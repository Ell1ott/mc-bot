<script lang="ts">
	import { io } from 'socket.io-client';

	import '../app.pcss';
	import { settings, socket } from './store';
	// import { socket } from "./stores.js";
	const client = new io.connect('http://localhost:6801', {
		reconnection: true,
		reconnectionDelay: 200,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: 30
	});
	console.log('hello');
	client.on('connect', () => {
		console.log('connected');
	});

	socket.set(client);
	$: console.log('socket: ', $socket);

	$: $socket?.on('settings', (botSettings: any) => {
		settings.set(botSettings);
		console.log('got settings from bot');
	});

	$: $socket?.on('log', (msg: string) => {
		console.log(msg);
	});

	import * as settingsjson from '$lib/bot-settings.json';

	// console.log(settingsjson.fishing);

	settings.set(settingsjson.default);

	let currenttheme = 'dark';
</script>

<div class="{currenttheme} min-h-screen">
	<slot />
</div>
