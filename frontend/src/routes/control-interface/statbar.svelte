<script>
	export let img;
	export let bgimg;
	// export let height;
	export let color;
	export let bgcolor;
	export let statName;
	export let deafult;
	export let aspect = 10;
	let stat = deafult;
	import { on } from "./socketHandler";
	on(statName, (newstat) => (stat = newstat));
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
