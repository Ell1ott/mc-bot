<script>
  export let height;
</script>

<div style="height: {height ? height : '2px'};" />

<style>
  div {
    width: 100%;
    background-color: var(--accent-color);

    margin-top: 0;
    margin-bottom: 10px;
  }
</style>
