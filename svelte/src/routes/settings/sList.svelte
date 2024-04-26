<script>
	import { validate_each_argument } from "svelte/internal";

	export let values;
	export let displayName;
	export let name;

	function addElement() {
		values = [...values, ""];
	}

	function removeElement(i) {
		values.splice(i, 1);
		values = values;
	}
	function handleKeyDown(event) {
		if (event.key === "Enter") {
			event.preventDefault(); // prevent default form submission behavior
			// event.target.blur(); // exit the input field
			if (values) if (values[values.length - 1] !== "") addElement();

			setTimeout(() => {
				const nextInput =
					document.getElementsByClassName("listinput")[values.length - 1];
				if (nextInput) nextInput.focus();
			});
		}
	}
</script>

<div class="container">
	<p class="">{displayName}</p>
	<div id="fields">
		{#each values as val, index}
			<div class="field">
				<input
					type="text"
					class="listinput"
					bind:value={val}
					name={name + "." + index}
					on:keydown={handleKeyDown}
				/>
				<button
					class="removebutton"
					type="button"
					on:click={() => removeElement(index)}
				>
					<img src="/images/closebutton.png" alt="" />
				</button>
			</div>
		{/each}
		<button id="addbutton" type="button" on:click={addElement}>
			<img src="/images/closebutton.png" alt="" />
		</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		gap: 10px;
	}

	img {
		height: 25px;
		aspect-ratio: 1;
	}
	p {
		font-size: 20px;
		padding: 5px;
	}

	input {
		padding-right: 0px;
	}

	.field {
		background-color: rgb(39 37 37);
		border-radius: 15px;
		display: inline-flex;

		background-color: rgb(48, 48, 48);
		/* padding: 5px; */
		/* margin: 0; */
		/* border-radius: 5px; */
		border: black 2px solid;
		/* margin-right: auto; */
		display: flex;
		justify-content: center;
		align-items: center;

		/* width: 25px; */
		/* height: 16px; */
	}

	#fields {
		display: inline-flex;
		flex-direction: column;
		gap: 5px;
		margin-left: auto;
	}

	button {
		border: none;
		background: none;
	}

	.removebutton {
		aspect-ratio: 1;
		height: 25px;
		margin: 0;
		margin-right: 1px;
		padding: 0;
		/* position: absolute; */
		/* right: 15px; */

		/* background-color: var(--accent); */
	}
	.removebutton img {
		filter: invert(18%) sepia(95%) saturate(0) hue-rotate(350deg)
			brightness(86%) contrast(139%);
		transition: all 0.2s;
	}

	.removebutton:hover img {
		filter: invert(20%) sepia(95%) saturate(2000%) hue-rotate(350deg)
			brightness(90%) contrast(139%);
	}

	#addbutton {
		/* background-color: var(--accent); */
		/* aspect-ratio: 1; */
		height: 30px;
		min-width: 30px;

		/* width: 30px; */
		padding: 0;
		border-radius: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		/* margin-top: 5px; */
		background-color: var(--accent-color);
	}

	#addbutton img {
		transform: rotate(45deg);
		margin: auto;
	}
</style>
