<script>
  import SMode from "./sMode.svelte";
  import SOption from "./sOption.svelte";
  import SSwitch from "./sSwitch.svelte";
  import { validate_each_argument, validate_slots } from "svelte/internal";
  import SCollapsible from "./sCollapsible.svelte";
  import SSlider from "./sSlider.svelte";
  import SList from "./sList.svelte";

  export let settings;
  export let nameprefix = "";
</script>

{#each settings as [name, setting]}
  <!-- <p>{name}: {setting.d} - {setting.t}</p> -->
  {#if !("val" in setting)}
    <SCollapsible
      name={nameprefix + "." + name}
      displayName={name}
      enabled={setting.enabled}
      togglable
    >
      <svelte:self
        nameprefix={nameprefix + "." + name}
        settings={Object.entries(setting).slice(1)}
      />
    </SCollapsible>
  {:else if setting.t === "range"}
    <!-- content here -->
    <SSlider
      name={nameprefix + "." + name}
      displayName={setting.d}
      range={setting.val.length == 2}
      step={setting.step || 1}
      min={setting.range[0]}
      max={setting.range[1]}
      value={setting.val}
      toggleable={"enabled" in setting}
      enabled={setting.enabled}
    />
  {:else if setting.t === "bool"}
    <SSwitch
      name={nameprefix + "." + name}
      displayName={setting.d}
      checked={setting.val}
    />
  {:else if setting.t === "list"}
    <SList
      values={setting.val}
      name={nameprefix + "." + name}
      displayName={setting.d}
    />
  {:else if setting.t === "option"}
    <SOption
      values={setting.val}
      name={nameprefix + "." + name}
      displayName={setting.d}
      options={setting.options}
    />
  {:else if setting.t === "mode"}
    <SMode
      name={nameprefix + "." + name}
      displayName={name}
      modes={setting.modes}
      mode={setting.val}
      {nameprefix}
    />
  {/if}
{:else}
  <p>no settings available</p>
{/each}

<style>
  p {
    padding: 0;
    margin: 0;
    font-size: 15px;

    color: rgb(123, 123, 123);
  }
</style>
