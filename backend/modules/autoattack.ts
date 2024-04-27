import { BotInstance } from "../bot";
import { Module } from "./module";

const mineflayer = require("mineflayer");
// let bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settingHelper");
const { getCooldown } = require("mineflayer-pvp");

class AutoAttack extends Module {
	attacking = false;

	start() {
		this.attacking = true;
		this.attack();
	}

	stop() {
		this.attacking = false;
	}
	// let attackLoop = null;

	async attack() {
		let target = bot.nearestEntity(
			(e) => e.type === "mob" || e.type === "player"
		);
		if (!target) {
			setTimeout(this.attack, 100);
			return;
		}

		let pos = target.position.offset(0, target.height, 0);

		if (
			pos.distanceTo(bot.entity.position.offset(0, bot.entity.height, 0)) > 3
		) {
			setTimeout(this.attack, 100);
			return;
		}
		if (getSetting(this.settings.autoattack.rotation)) {
			bot.lookAt(pos, false);
		}
		// bot.lastSentYaw;

		bot.hello = "hej";

		if (
			bot.entityAtCursor(3.5, true) === target ||
			!getSetting(this.settings.autoattack.onlywhenlooking)
		) {
			bot.attack(target);
		}
		// bot.attack(entity);
		const heldItem = bot.inventory.slots[bot.getEquipmentDestSlot("hand")];
		// await bot.waitForTicks(30);
		await bot.waitForTicks(getCooldown(heldItem?.name));
		// console.log(heldItem?.name);

		if (!this.attacking) return;
		setTimeout(this.attack, 100);
		// setTimeout(attack, 1000);
	}
}

module.exports = {
	AutoAttack,
};
