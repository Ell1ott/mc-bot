<script>
	export let name;
	export let img;
	export let tooltip;
	export let enabled = false;
	export let type = 'module';
	export let settingsOpen;
	export let isOpen;
	export let smooth;
	export let displayName = tooltip;
	import Overlaysettings from '../../settings/overlaysettings.svelte';
	import { socket } from '../../../store';

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
			on:mousedown={(e) => {
				if (e.which == 3) {
					e.preventDefault();
					settingsOpen.open();
					console.log('hehe');
				}
			}}
			on:contextmenu={(e) => {
				e.preventDefault();
			}}
		>
			<img src={img} alt="" class:pixel={!smooth} />
		</div>
	</label>
	<Overlaysettings bind:this={settingsOpen} {isOpen} {name} {img} {displayName}>
		<slot />
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
		z-index: 100;
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
