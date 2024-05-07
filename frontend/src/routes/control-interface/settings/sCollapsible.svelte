<script>
	import CustomCollapsibleCard from './CustomCollapsibleCard.svelte';

	// import { CollapsibleCard } from "svelte-collapsible";
	import Switch from './switch.svelte';

	export let name;
	export let displayName;
	export let togglable;
	export let open;
	export let enabled;
</script>

<CustomCollapsibleCard bind:open>
	<button
		on:click={() => {
			open = !open;
		}}
		slot="header"
		class="header w-full flex text-left items-center p-3 px-4"
	>
		{#if togglable}
			<Switch name={name + '.enabled'} bind:checked={enabled} />
		{/if}
		<h3 class="p-0 m-0 text-xl">
			{displayName.replaceAll('_', ' ')}
		</h3>
		<slot name="header"><!-- optional fallback --></slot>
	</button>
	<div slot="body" id="body">
		<slot><p>no settings available</p></slot>
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
		background-color: rgb(39 39 39);
		display: flex;
	}

	#body {
		padding: 10px;
	}

	p {
		padding: 0;
		margin: 0;

		color: rgb(123, 123, 123);
	}
</style>
