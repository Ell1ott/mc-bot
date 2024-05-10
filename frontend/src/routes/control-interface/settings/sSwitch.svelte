<script>
	import SettingName from './SettingName.svelte';
	import Switch from './switch.svelte';
	export let name;
	export let displayName = name;
	export let checked;
</script>

<div id="parent">
	<Switch bind:checked {name} />
	<SettingName name={displayName} />
</div>

<style>
	#parent {
		display: flex;
		align-items: center;
	}
</style>
