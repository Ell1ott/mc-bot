<script>
	import Fishing from './units/fishing.svelte';

	import Unit from './Unit.svelte';
	import RotCircel from './units/rotcircel.svelte';
	import Movementcontrol from './movementcontrol.svelte';
	import Playerinfo from './playerinfo.svelte';
	import UnitContent from './Unit-content.svelte';

	import Chat from './units/chat.svelte';
	import QuickModules from './modules/quickModules/quickModules.svelte';
	import { currentBot, socket } from '../store';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	console.log($currentBot);
	if (!$currentBot) {
		goto('overview');
	}
	onMount(() => {
		if ($currentBot !== null) $socket?.emit('selectBot', $currentBot);
	});
</script>

<!-- <h1>Welcome to SvelteKit</h1> -->
<!-- <img src={idk} alt="idk" /> -->

<div class="units theme gap-3 p-3 h-screen">
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
	<div class="flex flex-1 min-h-0 gap-3">
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
	}

	#header {
		height: 250;
	}
</style>
