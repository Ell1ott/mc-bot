<script lang="ts">
	import { socket } from '../store';
	import Statbar from './statbar.svelte';

	import heart from '$lib/heart/red-heart.png';
	import bgheart from '$lib/heart/black-heart.png';

	import food from '$lib/food/food.png';
	import bgfood from '$lib/food/Untitled.png';
	import PlayerHead from '$lib/components/playerHead.svelte';

	let name = 'bot';

	interface Position {
		x: number;
		y: number;
		z: number;
	}
	let position: Position = { x: -168.1426791971257, y: 70, z: -265.73267017388997 };

	$socket.on('username', (username: string) => {
		name = username;
		console.log('players username is ' + username);
	});
	$socket?.on('pos', (pos: Position) => {
		position = pos;
	});
	let level: number = 0;
	$socket?.on('xp.level', (_level: number) => {
		level = _level;
	});

	function formatNumber(num: number) {
		return num.toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 1
		});
	}
</script>

<div id="player-info">
	<div id="headandstats">
		<div id="headstats">
			<h1>{name}</h1>
			<p>
				x: {formatNumber(position.z)} y: {formatNumber(position.y)} z: {formatNumber(position.z)}
			</p>
		</div>
		<PlayerHead {name} />
	</div>

	<Statbar img={heart} bgimg={bgheart} statName="health" />
	<Statbar img={food} bgimg={bgfood} statName="food" />
	<p>level: {level}</p>
</div>

<style>
	#headandstats {
		display: flex;
	}

	#headstats {
		display: flex;
		flex-direction: column;
		align-items: flex-end;

		margin-right: 10px;

		/* height: px; */

		margin-bottom: 20px;
	}

	p {
		margin-top: auto;
		margin-bottom: 5px;
	}

	h1 {
		margin-top: 10px;
		margin-bottom: 10px;
		font-weight: 500;
	}
	#player-info {
		width: 300px;
		/* height: 100px; */
		overflow: hidden;
		display: flex;
		/* align-self: flex-end; */
		align-items: flex-end;
		flex-direction: column;
		gap: 15px;
		/* height: 100px; */
		/* justify-self: flex-end; */
		margin-left: auto;
		position: relative;
		background-color: var(--accent);

		border-radius: 0 15px 15px 0;

		padding: 15px;
	}

	#player-head {
		height: 90px;
	}
</style>
