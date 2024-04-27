import { flipflopWithRandomDelay } from "../looper";
import { Module } from "./module";
const { setTimeout: wait } = require("timers/promises");
class AntiAfk extends Module {
	sneakLoop = { stopLoop: () => {} };

	start() {
		console.log(this.botInstance.settings.antiafk);
		console.log(this.botInstance.settings.antiafk.sneaking.sneakinglength.val);
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
export { AntiAfk };
