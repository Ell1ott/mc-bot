<script>
	import Fishing from "./units/fishing.svelte";

	import Unit from "./Unit.svelte";
	import Splitter from "./splitter.svelte";
	import RotCircel from "./units/rotcircel.svelte";
	import Movementcontrol from "./movementcontrol.svelte";
	import { writable } from "svelte/store";
	import Playerinfo from "./playerinfo.svelte";
	import UnitContent from "./Unit-content.svelte";
	import { socket } from "./store";
	import { settings } from "./store";
	import { io } from "socket.io-client";
	import { onMount } from "svelte";
	import { time_ranges_to_array } from "svelte/internal";
	import Quickmodule from "./modules/quickModules/quickmodule.svelte";

	import fishing_rod from "$lib/fishing_rod.png";

	import golden_carrot from "$lib/food/golden_carrot.png";
	import diamond_sword from "$lib/diamond_sword.png";
	import Chat from "./units/chat.svelte";
	import ItemCounter from "./smallComponements/itemCounter.svelte";
	import QuickModules from "./modules/quickModules/quickModules.svelte";
	// import golden_carrot from "";

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
		// console.log(Object.entries($settings));
	});

	// $socket?.emit("rot", 45);

	$socket?.on("log", (msg) => {
		console.log(msg);
	});
	onMount(async () => {});

	import * as settingsjson from "$lib/bot-settings.json";

	// console.log(settingsjson.fishing);

	settings.set(settingsjson.default);

	let currenttheme = "dark";
</script>

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css?family=Comfortaa"
/>
<!-- <h1>Welcome to SvelteKit</h1> -->
<!-- <img src={idk} alt="idk" /> -->

<div class="units theme {currenttheme} gap-3" style="">
	<!-- control header -->
	<div id="header">
		<Unit class="flex">
			<UnitContent class="flex gap-2">
				<RotCircel />
				<Movementcontrol />
			</UnitContent>
			<Playerinfo />
		</Unit>
	</div>
	<div class="flex flex-1 gap-3">
		<div class="consoles flex flex-1">
			<Unit class="flex-1">
				<Chat />
			</Unit>
		</div>
		<div class="modules flex flex-col gap-3">
			<Unit display="inline-flex">
				<UnitContent>
					<QuickModules />
				</UnitContent>
			</Unit>
			<Fishing />
		</div>
	</div>
</div>

<!-- <Unit name="fishing" /> -->
<style>
	:global(body:has(.dark)) {
		--bg-color: rgb(31 31 31);

		--face-color: rgb(46, 46, 46);
		--accent: rgb(65, 65, 65);
		--accent-color: rgb(43, 87, 125);
		--accent-color-secondary: rgb(27, 145, 123);
		--reverse-accent: rgb(28, 28, 28);

		--font: rgb(201, 201, 201);
		--font-accent: white;
	}

	:global(body) {
		font-family: "Comfortaa", sans-serif;
		color: var(--font);
		background-color: var(--bg-color);

		padding: 13px;
		/* height: 100%; */
		/* margin: 0; */
		/* height: 100vh; */
		flex: 1;
	}

	:global(select) {
		font-size: 16px;
		font-family: "Comfortaa", sans-serif;
		color: var(--font);
	}

	:global(html) {
		height: 100%;
		display: flex;
	}
	:global(h2) {
		margin-top: 5px;
		margin-bottom: 5px;
		font-weight: normal;
	}

	:global(p) {
		font-family: "Comfortaa", sans-serif;
		color: var(--font);
	}

	:global(input) {
		font-family: "Comfortaa", sans-serif;
		color: var(--font);
	}

	:glaob(.hfill) {
		height: 100%;
	}

	:global(input:focus) {
		outline: none;
	}

	:global(img.pixel) {
		image-rendering: pixelated;
	}
	.units {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	:global(.flex) {
		display: flex;
	}

	:global(.column) {
		flex-direction: column;
	}
	:global(.gap) {
		gap: 10px;
	}

	:global(.flex1) {
		flex: 1;
	}

	.flex-end {
		margin-left: auto;
	}

	:global(p) {
		margin: 0;
	}

	:global(input) {
		border: none;
		background-color: transparent;
		font-size: 16px;
		flex: 1;
		padding: 10px;
		color: var(--font);
		/* margin-bottom: 1px; */
	}

	.consoles {
		max-width: 800px;
		height: calc(100vh - 300px);
	}

	#header {
		height: 250;
	}
</style>
