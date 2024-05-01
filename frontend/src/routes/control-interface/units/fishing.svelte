<script>
	import SSlider from "../settings/sSlider.svelte";
	// import SSlider from "./../settings/sSlider.svelte";
	import Unit from "../Unit.svelte";
	import UnitContent from "../Unit-content.svelte";
	import fishing_rod from "$lib/fishing_rod.png";
	import ItemCounter from "../smallComponements/itemCounter.svelte";
	import Quickmodule from "../modules/quickModules/quickmodule.svelte";
	import UnitHeader from "../unit-header.svelte";
	import { settings } from "../../store";
	import { socket } from "../../store";
	import Settings from "../settings/settings.svelte";

	let fishingLoot = [
		"cod",
		"salmon",
		"tropical_fish",
		"pufferfish",
		"bow",
		"enchanted_book",
		"fishing_rod",
		"name_tag",
		"nautilus_shell",
		"saddle",
		"prismarine_shard",
	];

	let enchantedBooks = [
		// [{ name: "protection", lvl: 3 }],
		// [
		//   { name: "unbreaking", lvl: 3 },
		//   { name: "smite", lvl: 4 },
		// ],
		// [
		//   { name: "aqua_affinity", lvl: 1 },
		//   { name: "riptide", lvl: 2 },
		// ],
		// [{ name: "piercing", lvl: 4 }],
		// [{ name: "sharpness", lvl: 3 }],
		// [
		//   { name: "loyalty", lvl: 3 },
		//   { name: "power", lvl: 4 },
		// ],
		// [{ name: "unbreaking", lvl: 3 }],
	];

	$socket?.on("enchantedbooks", (books) => {
		enchantedBooks = books;
	});
</script>

<Unit name="fishing" icon={fishing_rod}>
	<UnitHeader
		name="fishing"
		modulename="fishing"
		icon={fishing_rod}
		enabled={$settings.fishing.enabled}
	>
		<Settings
			nameprefix="fishing"
			settings={Object.entries($settings.fishing).slice(1)}
		/>
	</UnitHeader>
	<UnitContent>
		<div class="stats">
			{#each fishingLoot as itemName}
				<!-- content here -->
				<ItemCounter name={itemName} />
			{/each}
		</div>
		<div class="enchanted-books">
			{#each enchantedBooks as enchantments}
				<!-- content here -->
				<div class="ebook flex">
					{#each enchantments as e, index}
						<p>
							{e.name}
							{e.lvl}{index !== enchantments.length - 1 ? ", " : ""}
						</p>
						<!-- content here -->
					{/each}
				</div>
			{/each}
		</div>
		<!-- <Quickmodule
      type="setting"
      name="fishing.storeaway"
      img="https://mc.nerothe.com/img/1.19.2/chest.png"
      smooth
      tooltip="store away"
    >
      <Settings
        nameprefix="fishing.storeaway"
        settings={Object.entries($settings.fishing.storeaway).slice(1)}
      />
    </Quickmodule> -->
	</UnitContent>
</Unit>

<style>
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
	}

	.ebook {
		padding: 2px;
		border: 2px var(--accent-color) solid;
		margin: 2px;
		border-radius: 5px;
		gap: 5px;

		background-color: rgb(36, 36, 36);
	}
</style>
