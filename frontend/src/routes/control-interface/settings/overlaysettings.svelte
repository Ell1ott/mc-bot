<script>
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';

	import { socket } from '../../store';
	export let isOpen = false;
	export let name = 'unknownName';
	export let displayName = 'settings';
	export let img;
	export let desciption = null;

	export const open = () => {
		isOpen = true;
	};

	let displayNone = true;

	const handleSubmit = (e) => {
		console.log('handleling submit');
		const myForm = e.target;
		const formData = new FormData(myForm);

		const elemets = myForm.querySelectorAll('input, select');

		console.log(elemets.length);

		elemets.forEach((element) => {
			const value = element.type == 'checkbox' ? element.checked : element.value;
			if (element.type === 'radio' && !element.checked) return;
			console.log(element.name, value);
			$socket?.emit('setting.set', element.name, value);
		});
	};
</script>

<Dialog bind:open={isOpen}>
	<DialogContent class="min-w-[40rem] bg-card/50 backdrop-blur-sm rounded-none">
		<DialogHeader>
			<DialogTitle class="flex items-center gap-2 text-2xl">
				<img src={img} class="icon pixel" alt="" />
				{displayName}
			</DialogTitle>
			<DialogDescription></DialogDescription>
		</DialogHeader>
		<slot></slot>
	</DialogContent>
</Dialog>

<!-- <div class="overlay {isOpen ? 'open' : ''}">
	<form action on:submit|preventDefault={handleSubmit}>
		<button
			id="closebutton"
			on:click={() => {
				isOpen = false;
				setTimeout(() => {
					displayNone = true;
				}, 1000);
			}}
		>
			<img src="/images/closebutton.png" alt="" />
		</button>
		<div class="header">
			<img src={img} class="icon pixel" alt="" />
			<h3>{displayName}</h3>
		</div>

		<slot />
	</form>
</div> -->

<style>
	.overlay {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
		z-index: 9999;
		background-color: rgba(62, 62, 62, 0.718);
		color: white;
		/* padding: 20px; */
		font-size: 24px;
		box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.382);

		width: 600px;
		min-height: 100px;
		border-radius: 10px;
		transition:
			transform 0.5s,
			visibility 0.5s step-end;
		transition-delay: 0, 1s;

		/* overflow: scroll; */
		visibility: hidden;

		padding: 10px;
	}

	.header {
		display: flex;
		align-items: center;
	}

	.icon {
		/* aspect-ratio: 1; */
		width: 40px;
		/* height: 100%; */
	}

	:global(h3) {
		font-weight: 400;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	h3 {
		margin: 10px;
	}

	.background {
		opacity: 0;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.176);
		z-index: 100;
		position: absolute;
		transition:
			opacity 0.5s,
			backdrop-filter 0.5s,
			visibility 0.5s step-end;
		/* display: none; */
		/* backdrop-filter: blur(0px); */
		visibility: hidden;
		backdrop-filter: blur(3px);
	}

	.background.open {
		opacity: 1;
		visibility: visible;

		transition-timing-function: ease, ease, step-start;

		/* backdrop-filter: blur(10px) opacity(1); */
	}

	.overlay.open {
		transform: translate(-50%, -50%) scale(1);

		visibility: visible;
		transition-timing-function: ease, step-start;
	}
	#closebutton {
		padding: 0;
		border: none;
		height: 30px;

		background-color: transparent;
		float: right;
		margin: 2px;
		filter: invert(0.1);
	}

	#closebutton img {
		height: 30px;
		margin: 0;
	}
</style>
