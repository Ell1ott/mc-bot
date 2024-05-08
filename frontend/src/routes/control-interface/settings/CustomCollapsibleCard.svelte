<script>
	import Card from '$lib/components/ui/card/card.svelte';
	import { createEventDispatcher } from 'svelte';
	import collapse from 'svelte-collapse';

	export let open = true;
	export let duration = 0.4;
	export let easing = 'cubic-bezier(0.31, 0.84, 0.25, 0.98)';

	const dispatch = createEventDispatcher();

	function handleToggle() {
		open = !open;

		if (open) {
			dispatch('open');
		} else {
			dispatch('close');
		}
	}
</script>

<Card class="card overflow-hidden" aria-expanded={open}>
	<div class="card-header">
		<slot name="header" />
	</div>

	<div class="card-body" use:collapse={{ open, duration, easing }}>
		<slot name="body" />
	</div>
</Card>

<style>
	.card-header {
		cursor: pointer;
		user-select: none;
	}
</style>
