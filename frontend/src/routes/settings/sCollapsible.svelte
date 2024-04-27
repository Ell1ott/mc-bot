<script>
  import CustomCollapsibleCard from "./CustomCollapsibleCard.svelte";

  // import { CollapsibleCard } from "svelte-collapsible";
  import Switch from "./switch.svelte";

  export let name;
  export let displayName;
  export let togglable;
  export let open;
  export let enabled;
</script>

<div id="outline">
  <CustomCollapsibleCard bind:open>
    <div slot="header" class="header">
      {#if togglable}
        <Switch name={name + ".enabled"} bind:checked={enabled} />
      {/if}
      <h3
        on:click={() => {
          open = !open;
        }}
        on:keyup={() => {}}
      >
        {displayName.replaceAll("_", " ")}
      </h3>
      <slot name="header"><!-- optional fallback --></slot>
    </div>
    <div slot="body" id="body">
      <slot><p>no settings available</p></slot>
    </div>
  </CustomCollapsibleCard>
</div>

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

    margin-right: 20px;
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
