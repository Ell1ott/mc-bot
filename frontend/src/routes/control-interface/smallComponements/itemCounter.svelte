<script>
  import { onMount } from "svelte";
  import { socket } from "../store";

  export let count = 0;

  export let name;

  export let text;

  onMount(() => {
    $socket?.on("updateItemCount." + name, (newCount) => {
      count = newCount;
    });
  });
</script>

<div>
  {#if name}
    <img src="/images/items/{name}.png" alt={name} />
  {/if}
  <p>{count}</p>
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin: 3px;
  }

  p {
    font-size: 100%;
    margin-top: 3px;
    margin-bottom: 3px;
  }

  img {
    height: 100%;

    image-rendering: pixelated;
  }
</style>
