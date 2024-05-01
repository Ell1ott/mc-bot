<script>
	export let img;
	export let bgimg;
	// export let height;
	export let color = "transparent";
	export let bgcolor = "transparent";
	export let statName = null;
	export let aspect = 10;
	export let stat = 0;

	import { on } from "../socketHandler";
	if (statName) {
		on(statName, (newstat) => (stat = newstat));
	}
</script>

<div
	class="bg-stat-bar w-full"
	style="background-size: auto 100%; background-color: {bgcolor
		? bgcolor
		: 'none'}; background-image: url({bgimg}); aspect-ratio: {aspect}"
>
	<div
		class="stat-bar"
		style="background-color: {color
			? color
			: 'none'}; background-image: url({img}); width:{stat * 5}%"
	/>
</div>

<style>
	.stat-bar {
		height: 100%;
		transition: width 500ms;
	}

	div {
		image-rendering: pixelated;
		background-size: auto 100%;
	}

	.bg-stat-bar {
		aspect-ratio: 10;
		/* width: 100%; */
		flex: 1;
		max-width: 300px;
		/* height: 10px; */
	}
</style>
