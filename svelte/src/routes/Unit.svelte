<script lang="ts">
	export let name = false;
	export let icon;
	export let flex1;

	import Quickmodule from "./modules/quickModules/quickmodule.svelte";
	import Splitter from "./splitter.svelte";
</script>

<div class={"unit " + $$props.class} class:flex1>
	<!-- {#if name}

    
  {/if} -->
	<slot />

	<!-- <div class="test" /> -->
</div>

<style>
	.unit {
		background-color: var(--face-color);

		border-radius: 15px;

		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
		overflow: hidden;
		min-height: 50px;
		min-width: 50px;
		margin-bottom: 15px;
	}
</style>
