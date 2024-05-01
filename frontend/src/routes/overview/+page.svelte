<script lang="ts">
	import Statbar from "./../control-interface/statbar.svelte";
	import PlayerHead from "./../../lib/components/playerHead.svelte";
	import { currentBot, socket } from "./../store.js";

	import heart from "$lib/heart/red-heart.png";
	import bgheart from "$lib/heart/black-heart.png";

	import food from "$lib/food/food.png";
	import bgfood from "$lib/food/Untitled.png";

	let bots: any = null;

	$: $socket?.emit("getBots");

	$: console.log($socket);

	$: $socket?.on("bots", (_bots: any) => {
		console.log(_bots);
		console.log("got bots");
		bots = _bots;
	});

	function selectBot(name: string) {
		currentBot.set(name);
	}
</script>

<div class="flex gap-2 p-4">
	{#if bots}
		{#each bots as bot}
			<button
				class="flex gap-2 p-3 rounded-md bg-slate-700 hover:bg-slate-600 transition-all"
				on:click={() => selectBot(bot.name)}
			>
				<div class="w-20 aspect-square">
					<PlayerHead name={bot.name} />
				</div>
				<div class="flex">
					<div
						class="flex flex-col max-h-[6rem] items-start min-w-[10rem] gap-1"
					>
						<h1 class="font-bold text-3xl">{bot.name}</h1>
						{#if bot.health}
							<Statbar img={heart} bgimg={bgheart} stat={bot.health} />
						{/if}
						{#if bot.food}
							<!-- content here -->
							<Statbar img={food} bgimg={bgfood} stat={bot.food} />
						{/if}

						{#if !bot.food && !bot.health}
							Not connected to server
						{/if}
					</div>
				</div>
			</button>
		{/each}
	{/if}
</div>
