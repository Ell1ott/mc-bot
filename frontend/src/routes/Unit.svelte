<script lang="ts">
	export let name = false;
	export let icon;
</script>

<div class={"unit " + ($$props.class || "")}>
	<slot />
</div>

<style>
	.unit {
		background-color: var(--face-color);

		border-radius: 15px;

		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
		overflow: hidden;
		min-height: 50px;
		min-width: 50px;
	}
</style>
