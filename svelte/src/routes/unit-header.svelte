<script>
  import { time_ranges_to_array } from "svelte/internal";
  import Quickmodule from "./modules/quickModules/quickmodule.svelte";
  export let icon;
  export let name;
  export let modulename;
  export let enabled;
</script>

<div id="header-div">
  {#if icon}
    <Quickmodule img={icon} {enabled} name={modulename} displayName={name}>
      <slot />
    </Quickmodule>
    <!-- <Quickmodule img={icon} name={name} /> -->
  {/if}
  <h2 class="header">{name}</h2>
</div>

<style>
  #header-div {
    overflow: hidden;

    border-radius: 10px 10px 0 0;
    background-color: rgba(54, 54, 54, 0.154);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
  }
</style>
