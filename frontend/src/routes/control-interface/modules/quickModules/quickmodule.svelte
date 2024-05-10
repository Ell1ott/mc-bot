<script lang="ts">
	import Overlaysettings from '../../settings/overlaysettings.svelte';
	import { socket } from '../../../store';
	import NoSettings from '$lib/components/NoSettings.svelte';

	export let name;
	export let img;
	export let tooltip = null;
	export let enabled = false;
	export let type = 'module';
	export let open = false;
	export let smooth = false;
	export let displayName = tooltip;

	function emit() {
		$socket?.emit(type === 'module' ? 'toggleModule' : 'setting.set', name, enabled);
	}
	//   $: console.log(areSettingsOpen);
</script>

<div class="cont flex flex-col items-center justify-center">
	<label>
		<input type="checkbox" bind:checked={enabled} on:click={emit} />
		<div
			class="checkbox-div"
			role="button"
			tabindex="0"
			on:contextmenu={(e) => {
				e.preventDefault();
				open = true;
			}}
		>
			<img src={img} alt="" class:pixel={!smooth} />
		</div>
	</label>
	<Overlaysettings bind:open {name} {img} {displayName}>
		<slot><NoSettings></NoSettings></slot>
	</Overlaysettings>
	{#if displayName}
		<p class="tooltip">{displayName}</p>
	{/if}
</div>

<style lang="scss">
	.checkbox-div {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		aspect-ratio: 1;
		height: 50px;

		background-color: var(--accent);
		transition: all 100ms;
		z-index: 2;
		position: relative;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	p {
		position: absolute;
		margin: 0;
		margin-top: 5px;
		margin-bottom: -5px;
		transform: translate(0, 28px);
		z-index: 10;
		font-size: 10px;
		opacity: 0;
		transition: all 200ms;
	}

	.cont:hover p {
		opacity: 1;

		transition: all 250ms 200ms;
	}

	img {
		height: 28px;
		/* image-rendering: pixelated; */
	}

	input {
		position: absolute;
		display: none;
	}

	input:checked + div {
		background-color: hsl(var(--accent));
		box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.252);
	}
</style>
