import { Module } from "./module";

class AutoLeave extends Module {
	onPlayerJoined(player) {
		if (!this.settings.playerjoin.enabled) return;
		if (this.settings.playerjoin.val.includes(player.username)) {
			this.bot.quit();
			this.info("left beacuse " + player.username + " joined");
		}
	}

	onHealthChange() {
		if (
			this.settings.health.enabled &&
			this.bot.health < this.settings.health.val
		) {
			this.bot.quit();
			this.info("left beacuse health got below " + this.settings.health.val);
			return;
		}
		if (this.settings.food.enabled && this.bot.food < this.settings.food.val) {
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

module.exports = {
	AutoLeave,
};
