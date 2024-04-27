<script>
  import { emit } from "./socketHandler.js";
  import MovementButton from "./movementButton.svelte";
  import arrow from "$lib/play.png";
  import jump from "$lib/jump.png";
</script>

<div id="buttons">
  <span />
  <MovementButton img={arrow} rotation="270deg" dir="forward" />
  <span />
  <MovementButton img={arrow} rotation="180deg" dir="left" />
  <MovementButton img={jump} rotation="270deg" dir="jump" />
  <MovementButton img={arrow} dir="right" />
  <span />
  <MovementButton img={arrow} rotation="90deg" dir="back" />
</div>

<style>
  div {
    /* width: 100px; */

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    aspect-ratio: 1;
    height: 100%;
    gap: 5px;
    /* aspect-ratio: 1;
   */
  }
</style>
