<script>
	import "../app.pcss";
	import { socket } from "./store";
	// import { socket } from "./stores.js";
	const client = new io.connect("http://localhost:6801", {
		reconnection: true,
		reconnectionDelay: 200,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: 30,
	});
	socket.set(client);
	console.log("hello");
	$socket?.on("connect", () => {
		console.log("connected");
	});

	$socket?.on("settings", (botSettings) => {
		settings.set(botSettings);
		console.log("got settings from bot");
	});

	$socket?.on("log", (msg) => {
		console.log(msg);
	});

	import * as settingsjson from "$lib/bot-settings.json";

	// console.log(settingsjson.fishing);

	settings.set(settingsjson.default);

	let currenttheme = "dark";
</script>

<div class={currenttheme}>
	<slot />
</div>
