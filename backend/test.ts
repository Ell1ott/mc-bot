import mineflayer from "mineflayer";
import { Bot } from "mineflayer";

const bot = mineflayer.createBot({
	host: "localhost", // minecraft server ip
	username: "Bot", // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
	auth: "offline", // for offline mode servers, you can set this to 'offline'
	port: 45486, // set if you need a port that isn't 25565
	version: "1.20.4", // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
	// password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
});
bot.loadPlugin(require("mineflayer-auto-eat").plugin);
import { plugin as autoeat } from "mineflayer-auto-eat";

bot.once("spawn", () => {
	(bot as Bot & { autoEat: any }).autoEat; // Initialize autoEat property
	(bot as Bot & { autoEat:  }).autoEat.options.priority = "foodPoints";
	(bot as Bot & { autoEat: any }).autoEat.options.startAt = 14;
	(bot as Bot & { autoEat: autoeat }).autoEat.options.bannedFood.push("golden_apple");
});
