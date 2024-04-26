import { BotInstance } from "../bot";

class Module {
	botInstance: BotInstance; // The bot instance
	settings;
	log: Function;
	alert: Function;
	info: Function;

	constructor(botInstance: BotInstance) {
		this.botInstance = botInstance;
		this.settings = botInstance.settings;
		this.log = botInstance.log;
		this.alert = botInstance.alert;
		this.info = botInstance.info;
	}

	start() {}
	stop() {}
}

export { Module };
