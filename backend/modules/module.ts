import { BotInstance } from "../bot";
import * as mineflayer from "mineflayer";
import type { ExtendedBot } from "../utils/extendedBot";
class Module<T = typeof Module.deafultSettings> {
	botInstance: BotInstance; // The bot instance
	bot: ExtendedBot;

	settingName: string;
	static moduleName = "Module";
	static deafultSettings = { enabled: false };

	constructor(botInstance: BotInstance, settingName: string) {
		if (!botInstance.bot) return;
		this.settingName = settingName;
		this.botInstance = botInstance;
		console.log("module setting name", this.settings);

		this.bot = botInstance.bot;
		this;
	}

	get settings(): T {
		return this.botInstance.settings[this.settingName];
	}

	get globalSettings(): any {
		return this.botInstance.settings;
	}

	log(msg: string) {
		this.botInstance.log(msg);
	}

	alert(msg: string) {
		this.botInstance.alert(msg);
	}

	info(msg: string) {
		this.botInstance.info(msg);
	}

	start() {}
	stop() {}
}

export { Module };
