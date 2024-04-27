import { BotInstance } from "../bot";
import mineflayer from "mineflayer";

class Module {
	botInstance: BotInstance; // The bot instance
	bot: mineflayer.Bot;
	settings;
	globalSettings;
	constructor(botInstance: BotInstance, settingName: string) {
		if (!botInstance.bot) return;
		this.botInstance = botInstance;
		this.settings = botInstance.settings[settingName];
		this.globalSettings = botInstance.settings;
		this.bot = botInstance.bot;
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
