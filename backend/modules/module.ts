import { BotInstance } from "../bot";
import mineflayer from "mineflayer";

class Module {
	botInstance: BotInstance; // The bot instance
	bot: mineflayer.Bot;
	settings;
	globalSettings;
	log: Function;
	alert: Function;
	info: Function;

	constructor(botInstance: BotInstance, settingName: string) {
		if (!botInstance.bot) return;
		this.botInstance = botInstance;
		this.settings = botInstance.settings[settingName];
		this.globalSettings = botInstance.settings;
		this.bot = botInstance.bot;
		this.log = botInstance.log;
		this.alert = botInstance.alert;
		this.info = botInstance.info;
	}

	start() {}
	stop() {}
}

export { Module };
