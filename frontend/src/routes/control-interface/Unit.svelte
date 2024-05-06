<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';

	export let name = false;
	export let icon = false;
</script>

<Card class={'rounded-lg ' + ($$props.class || '')}>
	<slot />
</Card>

<style>
</style>
