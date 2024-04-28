import { Module } from "./module";

const moduleSettings = {
	...Module.deafultSettings,
	health: {
		val: [5],
		enabled: true,
		range: [0, 20],
		t: "range",
		d: "health threshold",
	},
	food: {
		val: [5],
		enabled: false,
		range: [0, 20],
		t: "range",
		d: "food threshold",
	},
	playerjoin: {
		val: ["herobrine"],
		t: "list",
		d: "when player joins:",
	},
	player_too_close: {
		enabled: true,
		players: {
			val: ["playername"],
			t: "list",
			d: "players",
		},
		specifiedplayerdistance: {
			val: [20],
			enabled: true,
			range: [0, 200],
			t: "range",
			d: "specified player distance",
		},
		otherplayerdistance: {
			val: [20],
			enabled: true,
			range: [1, 200],
			t: "range",
			d: "other player distance",
		},
	},
};

class AutoLeave extends Module<typeof AutoLeave.deafultSettings> {
	static deafultSettings = moduleSettings;

	onPlayerJoined(player) {
		if (this.settings.playerjoin.val.includes(player.username)) {
			this.bot.quit();
			this.info("left beacuse " + player.username + " joined");
		}
	}

	onHealthChange() {
		if (
			this.settings.health.enabled &&
			this.bot.health < this.settings.health.val[0]
		) {
			this.bot.quit();
			this.info("left beacuse health got below " + this.settings.health.val);
			return;
		}
		if (
			this.settings.food.enabled &&
			this.bot.food < this.settings.food.val[0]
		) {
			this.bot.quit();
			this.info("left beacuse food got below " + this.settings.food.val);

			return;
		}
	}

	onEntityMoved(e) {
		if (!this.settings.player_too_close.enabled) return;
		// console.log();
		if (e.type !== "player") return;
		const dis = this.bot.entity.position.distanceTo(e.position);
		if (
			this.settings.player_too_close.players.val.some(
				(item) => item.toLowerCase() === e.username.toLowerCase()
			)
		) {
			if (!this.settings.player_too_close.specifiedplayerdistance.enabled)
				return;
			if (dis < this.settings.player_too_close.specifiedplayerdistance.val[0]) {
				this.bot.quit();
				this.bot.removeListener("entityMoved", this.onEntityMoved);

				this.info("left beacuse " + e.username + " got too close");
			}
			return;
		} else if (
			dis < this.settings.player_too_close.otherplayerdistance.val[0]
		) {
			if (!this.settings.player_too_close.otherplayerdistance.enabled) return;
			this.bot.quit();
			this.bot.removeListener("entityMoved", this.onEntityMoved);

			this.info("left beacuse " + e.username + " got too close");
			return;
		}
	}
	start() {
		this.bot.on("playerJoined", this.onPlayerJoined);
		this.bot.on("health", this.onHealthChange);
		this.bot.on("entityMoved", this.onEntityMoved);
	}

	stop() {
		this.bot.removeListener("playerJoined", this.onPlayerJoined);
		this.bot.removeListener("health", this.onHealthChange);
		this.bot.removeListener("entityMoved", this.onEntityMoved);
	}
}

export { AutoLeave, AutoLeave as module };
