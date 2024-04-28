import { flipflopWithRandomDelay } from "../looper";
import { Module } from "./module";
const { setTimeout: wait } = require("timers/promises");

import { antiafk as moduleSettings } from "../settings/settings.json";

class AntiAfk extends Module<typeof AntiAfk.deafultSettings> {
	sneakLoop = { stopLoop: () => {} };

	static deafultSettings = moduleSettings;

	start() {
		this.sneakLoop = flipflopWithRandomDelay(
			() => {
				this.bot.setControlState("sneak", true);
			},
			() => {
				this.bot.setControlState("sneak", false);
			},
			this.settings.sneaking.sneakinglength.val,
			this.settings.sneaking.timebetweensneaks.val
		);
	}
	stop() {
		this.sneakLoop.stopLoop();
	}
}
export { AntiAfk, AntiAfk as module };
