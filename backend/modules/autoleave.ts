import { BotInstance } from "../bot";
import { Module } from "./module";

class AutoLeave extends Module {
	playerJoined(player) {
		if (!this.settings.playerjoin.enabled) return;
		if (this.settings.playerjoin.val.includes(player.username)) {
			bot.quit();
			this.info("left beacuse " + player.username + " joined");
		}
	}

	healthChange() {
		if (this.settings.health.enabled && bot.health < this.settings.health.val) {
			bot.quit();
			this.info("left beacuse health got below " + this.settings.health.val);
			return;
		}
		if (this.settings.food.enabled && bot.food < this.settings.food.val) {
			bot.quit();
			this.info("left beacuse food got below " + this.settings.food.val);

			return;
		}
	}

	entityMoved(e) {
		if (!this.settings.player_too_close.enabled) return;
		// console.log();
		if (e.type !== "player") return;
		const dis = bot.entity.position.distanceTo(e.position);
		if (
			this.settings.player_too_close.players.val.some(
				(item) => item.toLowerCase() === e.username.toLowerCase()
			)
		) {
			if (!this.settings.player_too_close.specifiedplayerdistance.enabled)
				return;
			if (dis < this.settings.player_too_close.specifiedplayerdistance.val[0]) {
				bot.quit();
				bot.removeListener("entityMoved", this.entityMoved);

				this.info("left beacuse " + e.username + " got too close");
			}
			return;
		} else if (
			dis < this.settings.player_too_close.otherplayerdistance.val[0]
		) {
			if (!this.settings.player_too_close.otherplayerdistance.enabled) return;
			bot.quit();
			bot.removeListener("entityMoved", this.entityMoved);

			this.info("left beacuse " + e.username + " got too close");
			return;
		}
	}
	start() {
		bot.on("playerJoined", this.playerJoined);
		bot.on("health", this.healthChange);
		bot.on("entityMoved", this.entityMoved);
	}

	stop() {
		bot.removeListener("playerJoined", this.playerJoined);
		bot.removeListener("health", this.healthChange);
		bot.removeListener("entityMoved", this.entityMoved);
	}
}

module.exports = {
	AutoLeave,
};
