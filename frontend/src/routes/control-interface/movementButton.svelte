<script>
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import { socket } from '../store';

	export let dir;
	export let rotation = '0deg';
	export let img;
	let locked = false;

	function setControlState(control, state) {
		$socket.emit('setControlState', control, state);
	}

	function handeClickDown(e) {
		console.log(e.which);
		if (e.which === 1) {
			setControlState(dir, true);
			locked = false;
		} else if (e.which === 2) {
			e.preventDefault();
			locked = !locked;
			if (locked) {
				setControlState(dir, true);
			}
		}
	}
	function handeClickUp(e) {
		if (!locked) {
			setControlState(dir, false);
		}
	}
</script>

<button
	id={dir}
	class="{buttonVariants({
		variant: 'secondary'
	})} p-2 transition-all h-full size-full {locked ? 'locked' : ''}"
	on:mousedown={handeClickDown}
	on:mouseleave={handeClickUp}
	on:mouseup={handeClickUp}
>
	<img src={img} style="transform:rotate({rotation})" alt="movement-button-img" />
</button>

<style>
	img {
		aspect-ratio: 1;
		height: 20px;
		-webkit-user-drag: none;
		-moz-user-select: none;
		-khtml-user-select: none;
		user-select: none;
	}

	button {
		transition: all 300ms;
	}

	button:hover {
		scale: 1.05;
	}

	button:active {
		scale: 0.95;
		transition: all 100ms;
	}

	.locked {
		background-color: rgb(150, 0, 32);
		scale: 0.95 !important;
	}
</style>
