import { BotInstance } from "../bot";
import mineflayer from "mineflayer";

class Module {
	botInstance: BotInstance; // The bot instance
	bot: mineflayer.Bot;
	settingName: string;

	constructor(botInstance: BotInstance, settingName: string) {
		if (!botInstance.bot) return;
		this.settingName = settingName;
		this.botInstance = botInstance;

		this.bot = botInstance.bot;
	}

	get settings(): any {
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
