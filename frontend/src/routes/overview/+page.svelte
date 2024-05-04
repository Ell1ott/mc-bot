<script lang="ts">
	import Newbot from './newbot.svelte';
	import Statbar from './../control-interface/statbar.svelte';
	import PlayerHead from './../../lib/components/playerHead.svelte';
	import { Plus } from 'lucide-svelte';
	import { currentBot, socket } from './../store.js';

	import heart from '$lib/heart/red-heart.png';
	import bgheart from '$lib/heart/black-heart.png';

	import food from '$lib/food/food.png';
	import bgfood from '$lib/food/Untitled.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	// let bots: any = null;
	let bots = [
		{
			id: 'bot1',
			name: 'E2SY',
			health: 20,
			food: 20
		},
		{
			id: 'bot2',
			name: 'Bot',
			health: 20,
			food: 20
		},
		{
			id: 'bot3',
			name: 'Notch',
			health: 20,
			food: 20
		}
	];

	currentBot.set(null);
	$: $socket?.emit('deselectBot');

	$: $socket?.emit('getBots');

	$: console.log($socket);

	$: $socket?.on('bots', (_bots: any) => {
		console.log(_bots);
		console.log('got bots');
		bots = _bots;
	});

	function selectBot(name: string) {
		console.log('tried to select bot ', name);
		currentBot.set(name);
	}

	console.log('hi', bots);
</script>

<div class="p-4 space-y-4">
	<div class="flex gap-4 flex-wrap">
		{#if bots}
			{#each bots as bot}
				<button on:click={() => selectBot(bot.id)}>
					<Card
						class="flex gap-2 p-4 rounded-md hover:bg-accent transition-all hover:border-foreground/20 cursor-pointer"
					>
						<div class="w-20 aspect-square">
							<PlayerHead name={bot.name} />
						</div>
						<div class="flex">
							<div class="flex flex-col max-h-[6rem] items-start min-w-[10rem] gap-1">
								<h1 class="font-bold text-3xl text-foreground">{bot.name}</h1>
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
					</Card>
				</button>
			{/each}
		{/if}
	</div>
	<Newbot></Newbot>
</div>
