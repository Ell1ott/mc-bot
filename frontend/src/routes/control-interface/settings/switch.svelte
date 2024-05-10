<script>
	export let checked;
	export let name;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<label on:click|stopPropagation on:mousedown|stopPropagation>
	<input
		type="checkbox"
		id="lookAtEntityToggle"
		value="hej"
		bind:checked
		on:input={(e) => {}}
		{name}
	/>
	<div class="box" class:checked>
		<div class="bg">
			<div class="ball" />
		</div>
	</div>
</label>

<style>
	label:active .box .bg .ball {
		width: 20px;
		transition:
			all 0.3s,
			width 0.1s;
	}

	label:active .box.checked .ball {
		margin-left: 17.5px;
	}

	.box {
		/* background-color: black; */
		height: 20px;
		width: 50px;
	}

	.bg {
		background-color: #5a5a5a;
		height: 20px;
		width: 40px;

		border-radius: 100px;
		top: 50%;
		transform: translate(0, -50%);
		position: relative;

		transition: all 0.3s;

		display: flex;
		align-items: center;
	}

	.ball {
		height: 15px;
		width: 15px;
		margin: 2.5px;
		border-radius: 100px;
		background-color: #eeeeee;

		position: relative;
		transition:
			all 0.3s,
			width 0.3s 0.2s;
		/* transform: t; */
	}

	.checked .ball {
		margin-left: 22.5px;
	}

	.checked .bg {
		background-color: #0059bb;
	}

	label {
		display: flex;
		align-items: center;
	}

	input {
		position: absolute;
		display: none;
	}
</style>
