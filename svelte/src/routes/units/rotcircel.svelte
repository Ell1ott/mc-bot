<script>
	import { onMount } from "svelte";
	import creeper from "$lib/creeper.png";
	import headtop from "$lib/head-top.png";
	import { emit } from "../socketHandler.js";
	// socket.emit;
	let rotdeg = 0;
	function rotate(deg) {
		console.log("rotating to " + deg + " degree");
		rotdeg = deg;
		emit("rot", deg);
	}
	const smallButton = 20;
	const bigButton = 30;
	// const thickness = 20;

	const radius = (50 + 90) / 2; // adjust the radius as desired
	const numItems = 8; // adjust the number of items as desired
	//   const angle = -(i / numItems) * 2 * Math.PI - Math.PI / 2;
	let circel;
	let checked;
	$: emit("lookAtEntity", checked);
</script>

<label class="switch" id="lookAtEntityButton">
	<input type="checkbox" id="lookAtEntityToggle" bind:checked />
	<img
		src={creeper}
		alt="creeper"
		id="creeper-img"
		class="size-full img-button slider"
	/>
</label>
<div id="circle" bind:this={circel}>
	{#each Array(8) as _, index (index)}
		<input
			type="radio"
			name="rot"
			class="circle-item"
			value={index * 45}
			style="top: {50 +
				radius *
					Math.cos(-(index / numItems) * 2 * Math.PI - Math.PI)}%; left: {50 +
				radius *
					Math.sin(
						-(index / numItems) * 2 * Math.PI - Math.PI
					)}%; width: {index % 2 == 0 ? bigButton : smallButton}px"
			on:click={() => {
				rotate(index * 45);
				rotdeg = index * 45;
				console.log(rotdeg);
			}}
		/>
	{/each}
	<!-- <input type="radio" class="nopad" id="lookAtEntityButton" /> -->
	<!-- <div id="top-head"></div> -->
	<img
		src={headtop}
		id="top-head"
		alt="”idk”"
		style="transform: translate(-50%, -50%) rotate({rotdeg}deg);"
	/>
</div>

<style>
	#lookAtEntityButton {
		width: 20px;
		height: 20px;
		border: none;
		/* border-radius: 5px; */
		/* aspect-ratio: 1; */
		/* background-color: rgb(0, 0, 0); */
		/* top: -34px; */
		/* left: -34px; */
		/* position: absolute; */
		/* transform: translate(-50%, -50%); */

		transition: all 500ms;
		padding: 0;
	}

	#lookAtEntityToggle {
		position: absolute;
		display: none;
	}
	#creeper-img {
		/* border-radius: 5px 0 0 0; */
		image-rendering: pixelated;
		left: 0;
		right: 0;
		bottom: 0;
		/* box-shadow: 0px 0px 100px 0px rgb(0, 0, 0) inset; */
		transition: all 200ms;
		margin: 0;
		/* height: 100%;
    width: 100%; */
		opacity: 0.6;
	}

	label {
		position: absolute;
	}

	input:checked + #creeper-img {
		opacity: 1;
	}

	#circle {
		/* width: 120px; */
		/* height: 120px; */
		/* height: 75px; */
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: gray;
		border: 50px solid rgba(0, 0, 0, 0.813);
		position: relative;
		/* box-sizing: border-box; */
	}

	/* .pad {
    padding: 10px;
  } */
	.circle-item {
		/* width: 20px;
    height: 50px; */
		background-color: blue;
		/* border-radius: 50%; */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 0%;
		margin: 0%;
		position: absolute;
		aspect-ratio: 1;

		border: none;
	}

	#top-head {
		/* height: 30px; */
		width: 60px;
		aspect-ratio: 1;
		background-color: aliceblue;
		top: 50%;
		left: 50%;
		position: relative;
		transform-origin: center;

		transition: all 500ms;

		/* background-image: ; */
	}
</style>
