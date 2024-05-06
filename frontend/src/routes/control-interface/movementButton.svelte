<script>
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
	class="movement-button {locked ? 'locked' : ''}"
	on:mousedown={handeClickDown}
	on:mouseleave={handeClickUp}
	on:mouseup={handeClickUp}
>
	<img src={img} style="transform:rotate({rotation})" alt="movement-button-img" />
</button>

<style>
	button {
		border: none;
		background-color: var(--accent);
		color: white;
		padding: 2px;
		border-radius: 5px;
		aspect-ratio: 1;

		/* width: 60px; */
		transition: all 100ms;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 3px;
	}

	button:active {
		background-color: var(--accent-color);
	}

	img {
		aspect-ratio: 1;
		height: 20px;
		-webkit-user-drag: none;
		-moz-user-select: none;
		-khtml-user-select: none;
		user-select: none;
	}

	.locked {
		background-color: rgb(150, 0, 32);
	}
</style>
