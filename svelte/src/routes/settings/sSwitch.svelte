<script>
  import Switch from "./switch.svelte";
  export let displayName;
  export let name;
  export let checked;
</script>

<div id="parent">
  <Switch bind:checked {name} />
  <p>{displayName}</p>
</div>

<style>
  #parent {
    display: flex;
    align-items: center;
  }

  p {
    margin: 5px;
    font-size: 17px;
  }
</style>
