<script>
	import Quickmodule from "./quickmodule.svelte";
	import { settings } from "../../../store";
	import Settings from "../../settings/settings.svelte";
</script>

<div class="quickmodules">
	<Quickmodule
		img="/images/items/golden_carrot.png"
		name="autoeat"
		enabled={$settings.autoeat.enabled}
		tooltip="Auto eat"
	/>
	<Quickmodule
		img="/images/items/diamond_pickaxe.png"
		name="automine"
		enabled={$settings.automine.enabled}
		tooltip="Auto mine"
	>
		<Settings
			nameprefix="automine"
			settings={Object.entries($settings.automine).slice(1)}
		/>
	</Quickmodule>
	<Quickmodule
		img="/images/items/diamond_sword.png"
		name="autoattack"
		enabled={$settings.autoattack.enabled}
		tooltip="Auto Attack"
	>
		<Settings
			nameprefix="autoattack"
			settings={Object.entries($settings.autoattack).slice(1)}
		/></Quickmodule
	>

	<Quickmodule
		name="antiafk"
		enabled={$settings.antiafk.enabled}
		tooltip="Anti afk"
		img="/images/items/clock_10.png"
	>
		<Settings
			nameprefix="antiafk"
			settings={Object.entries($settings.antiafk).slice(1)}
		/>
	</Quickmodule>
	<Quickmodule
		name="autoleave"
		enabled={$settings.autoleave.enabled}
		tooltip="Auto leave"
		img="/images/items/barrier.png"
	>
		<Settings
			nameprefix="autoleave"
			settings={Object.entries($settings.autoleave).slice(1)}
		/>
	</Quickmodule>
	<Quickmodule
		name="treechopper"
		enabled={$settings.treechopper.enabled}
		tooltip="tree Chopper"
		img="https://mc.nerothe.com/img/1.19.2/spruce_log.png"
	>
		<Settings
			nameprefix="treechopper"
			settings={Object.entries($settings.treechopper).slice(1)}
		/>
	</Quickmodule>
</div>

<style>
	.quickmodules {
		display: grid;

		display: grid;
		grid-template-columns: repeat(4, 1fr);
		/* grid-template-rows: repeat(2, 1fr); */
		gap: 10px;
	}
</style>
