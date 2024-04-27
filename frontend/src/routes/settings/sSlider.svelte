<script>
	import Switch from "./switch.svelte";
	import Slider from "@bulatdashiev/svelte-slider";
	import RangeSlider from "svelte-range-slider-pips";
	import { validate_each_argument } from "svelte/internal";
	export let value = [10, 20];
	export let displayName;
	export let name;
	export let min;
	export let max;
	export let step;
	export let range;
	export let pips;
	export let pipstep;
	export let toggleable;
	export let enabled;
</script>

<div class="hej" class:disabled={!enabled && toggleable}>
	{#if toggleable}
		<Switch name={name + ".enabled"} bind:checked={enabled} />
	{/if}
	<p>{displayName}</p>
	<!-- <p class="value">
    {value[0].toPrecision(1)}-{value[1].toPrecision(1)}
  </p> -->
	<div id="fields">
		<input
			type="number"
			{step}
			lang="en"
			bind:value={value[0]}
			name={name + ".0"}
		/>
		{#if range}
			<p>-</p>
			<input
				type="number"
				{step}
				lang="en"
				bind:value={value[1]}
				name={name + ".1"}
			/>
		{/if}
		<div class="slider-div">
			<RangeSlider
				id="color-pips"
				range={range ? true : "min"}
				suffix=""
				{min}
				{max}
				{step}
				float
				name={["input-1", "input-2"]}
				bind:values={value}
				{pips}
				{pipstep}
			/>
		</div>
	</div>
	<!-- <div class="slider-div">
    <Slider
      {min}
      {max}
      {step}
      name={[name + ".min", name + ".max"]}
      bind:value
      range
    />
  </div> -->

	<!-- <Slider bind:value /> -->
</div>

<style>
	:global(#color-pips) {
		height: 6px;
	}

	:global(#color-pips .rangeHandle) {
		top: 3px;
		margin: auto;
		/* bottom: 0; */
		transform: translate(-50%, -50%);
		height: 20px;
		width: 20px;
		/* transition: all 1ms linear; */
	}
	:global(#color-pips .rangeHandle .rangeNub) {
		border-radius: 50%;
	}

	:global(#color-pips .rangeBar) {
		/* height: 6px; */
		height: inherit;
		top: 0;
		bottom: 0;
	}

	:global(#color-pips) {
		font-size: large;
		flex: 1;
	}

	.disabled {
		opacity: 0.3;
	}

	#fields {
		display: flex;
		align-items: center;
		margin-left: auto;
		/* gap: 0px; */
	}

	input {
		font-size: 17px;
		background-color: rgb(48, 48, 48);
		padding: 5px;
		margin: 0;
		border-radius: 5px;
		border: black 2px solid;
		margin-left: auto;
		width: 2.25rem;
		height: 1.75rem;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type="number"] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
	/* .value {
    font-size: 17px;
    background-color: rgb(48, 48, 48);
    padding: 5px;
    margin: 0;
    border-radius: 5px;
    border: black 2px solid;
    margin-left: auto;
  } */

	.hej {
		--range-handle-focus: #5784fd;
		--range-range: #8abdff;
		--range-slider: #646464;

		/* margin-top: 10px;
    margin-bottom: 10px; */
		display: flex;
		align-items: center;
	}

	p {
		margin: 5px;
		font-size: 17px;
	}

	.slider-div {
		width: 300px;

		margin-left: auto;
	}
</style>
