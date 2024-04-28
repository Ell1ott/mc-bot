import { flipflopWithRandomDelay } from "../looper";
import { Module } from "./module";
const { setTimeout: wait } = require("timers/promises");

const moduleSettings = {
	...Module.deafultSettings,

	sneaking: {
		enabled: true,
		timebetweensneaks: {
			val: [2, 3.6],
			range: [0.2, 10],
			step: 0.1,
			t: "range",
			d: "time between sneaks",
		},
		sneakinglength: {
			val: [1, 10],
			range: [0.2, 10],
			t: "range",
			d: "sneaking length",
			step: 0.1,
		},
	},
	jumping: {
		enabled: false,
	},
	rotation: {
		enabled: true,
	},
};

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
export { AntiAfk };
