import { Module } from "./module";

const mineflayer = require("mineflayer");
// let this.bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settings/settingHelper");
const { getCooldown } = require("mineflayer-pvp");

const moduleSettings = {
	...Module.deafultSettings,
	rotation: {
		val: true,
		t: "bool",
		d: "rotation",
	},
	onlywhenlooking: {
		val: true,
		t: "bool",
		d: "only if looking",
	},
	searchRadius: {
		val: [10],
		range: [1, 50],
		t: "range",
		d: "search radius",
	},
	attackRadius: {
		val: [3.5],
		range: [1, 10],
		t: "range",
		d: "attack radius",
	},
};

class AutoAttack extends Module<typeof AutoAttack.deafultSettings> {
	static deafultSettings = moduleSettings;

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
		if (!this.attacking) return;
		let target = this.bot.nearestEntity(
			(e) => e.type === "mob" || e.type === "player"
		);
		if (!target) {
			setTimeout(this.attack.bind(this), 100);
			return;
		}

		let pos = target.position.offset(0, target.height, 0);

		if (
			pos.distanceSquared(
				this.bot.entity.position.offset(0, this.bot.entity.height, 0)
			) >
			this.settings.searchRadius.val[0] ** 2
		) {
			setTimeout(this.attack.bind(this), 100);
			return;
		}
		if (getSetting(this.settings.rotation)) {
			this.bot.lookAt(pos, true);
		}

		if (
			this.bot.entityAtCursor(getSetting(this.settings.attackRadius), true) ===
				target ||
			!getSetting(this.settings.onlywhenlooking)
		) {
			this.bot.attack(target);
		}
		// this.bot.attack(entity);
		const heldItem =
			this.bot.inventory.slots[this.bot.getEquipmentDestSlot("hand")];
		// await this.bot.waitForTicks(30);
		await this.bot.waitForTicks(getCooldown(heldItem?.name));
		// console.log(heldItem?.name);
		setTimeout(this.attack.bind(this), 100);
		// setTimeout(attack, 1000);
	}
}

export { AutoAttack, AutoAttack as module };
