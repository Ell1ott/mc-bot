<script>
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import CustomCollapsibleCard from './CustomCollapsibleCard.svelte';

	// import { CollapsibleCard } from "svelte-collapsible";
	import Switch from './switch.svelte';
	import NoSettings from '$lib/components/NoSettings.svelte';

	export let name;
	export let displayName;
	export let togglable;
	export let open = true;
	export let enabled;

	$: console.log('open', open);
</script>

<CustomCollapsibleCard bind:open>
	<button
		on:click={(e) => {
			open = !open;
		}}
		slot="header"
		class="header w-full flex text-left items-center p-3 px-4"
	>
		{#if togglable}
			<Switch name={name + '.enabled'} bind:checked={enabled} stopPropagation />
		{/if}
		<h3 class="p-0 m-0 text-xl">
			{displayName.replaceAll('_', ' ')}
		</h3>
		<slot name="header"></slot>
		<div class="flex-1"></div>
		<ChevronDown class="text-foreground/80 transition-all duration-300 {!open ? 'rotate-90' : ''}"
		></ChevronDown>
	</button>
	<div slot="body" id="body">
		<slot><NoSettings></NoSettings></slot>
	</div>
</CustomCollapsibleCard>

<style>
	#outline {
		border: 5px rgb(39 39 39) solid;

		border-radius: 10px;
		padding: 0px;

		margin-top: 10px;
	}

	h3 {
		text-transform: capitalize;
	}

	.header {
		background-color: hsl(212, 12%, 17%);
		display: flex;
	}

	#body {
		padding: 10px;
	}
</style>
