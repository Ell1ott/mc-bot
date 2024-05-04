<script>
  import SOption from "./sOption.svelte";
  import SCollapsible from "./sCollapsible.svelte";

  // import { CollapsibleCard } from "svelte-collapsible";
  import Settings from "./settings.svelte";

	export let name;
	export let displayName;
	export let open;
	export let enabled;
	export let modes;
	export let mode;
	export let nameprefix;
</script>

<SCollapsible {name} {displayName} {open}>
	<SOption slot="header" options={Object.keys(modes)} bind:value={mode} {name} />
	{#each Object.entries(modes) as [n, settings]}
		<div hidden={n !== mode}>
			<Settings nameprefix={nameprefix + '.mode.modes.' + n} settings={Object.entries(settings)} />
		</div>
	{/each}
</SCollapsible>

<style>
	#outline {
		border: 5px rgb(39 39 39) solid;

		border-radius: 10px;
		padding: 0px;

		margin-top: 10px;
	}

	h3 {
		font-size: 25px;
		flex: 1;
	}

	.header {
		margin-top: -1px;
		margin-bottom: -1px;
		padding: 7px;
		background-color: rgb(39 39 39);
		display: flex;
	}

	#body {
		padding: 10px;
	}

	p {
		padding: 0;
		margin: 0;
		font-size: 15px;

		color: rgb(123, 123, 123);
	}
</style>
