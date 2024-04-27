const http = require("http").createServer();
const inventoryViewer = require("mineflayer-web-inventory");
const autoeat = require("mineflayer-auto-eat").plugin;
const pvp = require("mineflayer-pvp").plugin;
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const { getCooldown } = require("mineflayer-pvp");
const fs = require("fs");
import { loadSettings, updateSetting, settings } from "./settingstest";

const gui = require("mineflayer-gui");
const mineflayerViewer = require("prismarine-viewer").mineflayer;

var Convert = require("ansi-to-html");
var convert = new Convert({ escapeXML: true });
const { flipflopWithRandomDelay, loopWithRandomDelay } = require("./looper.js");

const { getSetting } = require("./settingHelper.js");

const { modules } = require("./modules.js");

import mineflayer from "mineflayer";

// const fishing = require("./modules/fishing.js");
// const autoattack = require("./modules/autoattack.js");
// const automine = require("./modules/automine.js");
// fishing.asign(bot, log, alert);
// autoattack.asign(bot, log, alert);
// automine.asign(bot, log, alert);

// load all custom utilities
// bot.loadPlugin(require("./utils/blockutils.js").plugin);
// bot.loadPlugin(require("./utils/entityutils.js").plugin);
inventoryViewer(bot);

function lookAtEntity() {
	let friend = bot.nearestEntity();

	if (friend) {
		bot.lookAt(friend.position.offset(0, friend.height, 0));
	}
}

let itemCounterItems = [
	"cod",
	"salmon",
	"tropical_fish",
	"pufferfish",
	"bow",
	"enchanted_book",
	"fishing_rod",
	"name_tag",
	"nautilus_shell",
	"saddle",
	"prismarine_shard",
];

let enchantedBooks = [] as any[];

let runningloops = { antiafk: [] as any[] };
let itemCounters = {};

itemCounterItems.forEach((item) => {
	itemCounters[item] = 0;
});

// require("./utils/blockutils.js")(bot);
function canCraft(recipe, crafting_table) {
	const input = recipe.inShape || recipe.ingredients;
	let needsCraftingTable = input.length > 2 || input[0].length > 2;

	if (!crafting_table && needsCraftingTable) return false;
	let itemsNeeded: Record<string, number> = {};
	input.flat().forEach((id) => {
		if (id == null) return;
		itemsNeeded[id] = itemsNeeded[id] + 1 || 1;
	});

	const ids = Object.keys(itemsNeeded);
	const counts = Object.values(itemsNeeded);
	// log(itemsNeeded);
	// log(ids.map((x) => (!x ? null : bot.registry.items[x].name)));
	// log(counts);
	for (let i = 0; i < ids.length; i++) {
		if (bot.inventory.count(ids[i], null) < counts[i]) return false;
	}
	return true;
}

function canCraftItem(id, crafting_table) {
	const recipes = bot.registry.recipes[id];

	return canCraftRecipes(recipes, crafting_table);
}
function canCraftRecipes(recipes, crafting_table) {
	for (let i = 0; i < recipes.length; i++) {
		const recipe = recipes[i];

		if (canCraft(recipe, crafting_table)) return true;
	}
	return false;
}

function itemIdsToNames(ids, bot) {
	return ids.map((x) => (!x ? null : bot.registry.items[x].name));
}

function itemNamefromid(id, bot: mineflayer.Bot) {
	return bot.registry.items[id]?.name;
}

function getAllPosibleRecipes(bot: mineflayer.Bot) {
	const recipeItems = bot.registry.recipes;

	return Object.keys(recipeItems).filter((item) => canCraftItem(item, true));
}

import { EventEmitter } from "events";
import { Module } from "./modules/module";
import { Fishing } from "./modules/fishing";

class BotInstance {
	bot: mineflayer.Bot | null;
	io: any;
	previouspos: any = null;
	updPlayerLoop = null;
	settings = {};

	modules: Record<string, Module> = {};

	client = new EventEmitter();

	constructor(settingsPath) {
		this.bot = null;
		this.settings = loadSettings(settingsPath);
	}

	joinLocalhost(
		port,
		username = "bot",
		version = "1.20.4",
		auth: "offline" | "mojang" | "microsoft" | undefined = "offline"
	) {
		this.bot = mineflayer.createBot({
			host: "localhost",
			port: port,
			username: username,
			auth: auth,
			version: version,
		});
	}

	joinServer(
		ip,
		username = "bot",
		version = "1.20.4",
		auth: "offline" | "mojang" | "microsoft" | undefined = "offline"
	) {
		this.bot = mineflayer.createBot({
			host: ip,
			username: username,
			auth: auth,
			version: version,
		});
	}

	loadPlugins() {
		if (!this.bot) return;

		this.bot.loadPlugin(autoeat);
		(this.bot as any).autoEat.disable();
		this.bot.loadPlugin(pvp);
		this.bot.loadPlugin(pathfinder);
		this.bot.loadPlugin(gui.plugin);
		this.bot.loadPlugin(require("mineflayer-collectblock").plugin);
	}

	loadModules() {
		if (!this.bot) return;

		console.log("loading modules");

		console.log(new Fishing(this).name);
	}

	onCreate() {
		if (!this.bot) return;
		this.loadPlugins();
		this.loadModules();

		this.bot.on("kick", (reason) => {
			this.log("kicked: " + reason);
			this.alert("kicked from server");
		});
		this.bot.on("end", (reason) => {
			this.log("ended: " + reason);
			this.alert("disconnected from server");
		});

		this.bot.on("error", (err) => {
			this.log("error: " + err);
		});

		this.bot.once("spawn", () => {
			if (!this.bot) return;
			(this.bot as any).autoeat.options.priority = "saturation";
			(this.bot as any).autoEat.options.startAt = 19;
			(this.bot as any).autoEat.options.bannedFood.push(
				"golden_apple",
				"enchanted_golden_apple"
			);
			this.io?.emit("username", this.bot.username);

			this.io?.emit("craftableRecipes", getAllPosibleRecipes(this.bot));

			mineflayerViewer(this.bot, { port: 2000 });
		});

		this.bot.on("playerCollect", (collector, collected: any) => {
			if (!this.bot) return;

			const meta: any = collected.metadata[8];
			this.log(
				collector.username +
					" collocted " +
					meta?.itemCount +
					" " +
					itemNamefromid(meta?.itemId, this.bot)
			);

			if (meta?.itemId === 1006 && collector.username === this.bot.username) {
				// if the item is a enchanted book

				const enchantments = meta.nbtData.value.StoredEnchantments.value.value;

				const enchanted_book = enchantments.map((e) => {
					return {
						name: e.id.value.replace("minecraft:", ""),
						lvl: e.lvl.value,
					};
				});

				enchantedBooks.push(enchanted_book);

				this.log(enchantedBooks);
				this.io?.emit("enchantedbooks", enchantedBooks);
			}

			// this.log(collected.metadata[8]);

			if (collector === this.bot?.entity) {
				if (!this.bot) return;

				const itemName = itemNamefromid(
					collected.metadata[8]?.itemId,
					this.bot
				);
				if (itemName in itemCounters) {
					itemCounters[itemName] += collected.metadata[8]?.itemCount;
					this.io?.emit("updateItemCount." + itemName, itemCounters[itemName]);
					this.log(
						"bot has collected " + itemCounters[itemName] + " " + itemName
					);
				}
			}
		});
	}

	clientConnect(socket) {
		if (!this.bot) return;
		this.bot.on("entityMoved", (entity) => {
			if (entity == this.bot?.entity) {
				socket.emit("YawRot", this.bot?.entity.yaw);
			}
		});

		this.bot.on("message", (message) => {
			// console.log(message.toAnsi());
			// log(convert.toHtml(message.toAnsi()));
			socket.emit("message", convert.toHtml(message.toAnsi()));
			// io.emit("message", message.toString());
		});

		socket.emit("username", this.bot.username);
		socket.emit("settings", settings);
		Object.entries(itemCounters).forEach(([itemName, count]) => {
			socket.emit("updateItemCount." + itemName, count);
		});
		console.log("a user is connected to io socket");
		// itemCounters.forEach((k, v) => )

		this.client.on("setting.set", updateSetting);
		this.client.on("rot", (message) => {
			this.log("should now be rotating to " + message);
			this.bot?.look(
				(parseInt(message) / 180) * Math.PI,
				this.bot?.entity.pitch
			);
		});

		this.client.on("setControlState", (control, state) => {
			if (control == "jump" && autojump) return;
			this.bot?.setControlState(control, state);
		});

		this.client.on("lookAtEntity", (bool) => {
			if (bool) {
				this.bot?.on("move", lookAtEntity);
				console.log("now looking at entity");
			} else {
				this.bot?.removeListener("move", lookAtEntity);
			}
		});

		this.client.on("sendchat", (chat) => {
			this.bot?.chat(chat);
		});
		let autojump = false;

		this.client.on("toggleModule", (module, on) => {
			on = !on; // for some reason its flipped
			console.log(module + ".enabled", on);

			if (module in modules) {
				if (on) modules[module].start();
				else modules[module].stop();
			}

			updateSetting(module + ".enabled", on);
			switch (module) {
				case "autoeat":
					if (on) {
						(this.bot as any)?.autoEat.enable();
						try {
							(this.bot as any)?.autoEat.eat();
						} catch {}
					} else {
						(this.bot as any)?.autoEat.disable();
					}
					break;

				case "antiafk":
					if (on) {
						console.log(
							"snok ",
							settings.antiafk.sneaking.timebetweensneaks.val
						);
						runningloops.antiafk = [];
						if (getSetting(settings.antiafk.sneaking)) {
							const stopSneak = flipflopWithRandomDelay(
								() => {
									this.bot?.setControlState("sneak", true);
								},
								() => {
									this.bot?.setControlState("sneak", false);
								},
								settings.antiafk.sneaking.sneakinglength.val,
								settings.antiafk.sneaking.timebetweensneaks.val
							);
							runningloops.antiafk.push(stopSneak);
						}

						console.log(settings.antiafk.sneaking.sneakinglength.val);
					} else {
						// stopSneak();
						runningloops.antiafk.forEach((func) => {
							func();
						});
						this.bot?.setControlState("sneak", false);
					}
					break;

				default:
					console.log("the module: " + module + " does not exist");
					break;
			}
		});
	}

	clientDisconnect() {
		if (!this.bot) return;
		this.bot.removeAllListeners("entityMoved");
		this.bot.removeAllListeners("message");
	}

	log(msg) {
		this.io?.emit("log", msg);
		console.log(msg);
	}
	alert(msg) {
		this.io?.emit("alert", msg);
		console.warn(msg);
	}
	info(msg) {
		this.io?.emit("info", msg);
		console.info(msg);
	}

	updPlayerInfo() {
		if (!this.bot?.entity || !this.io) return;
		this.io.emit("health", bot.health);
		this.io.emit("food", bot.food);
		if (this.previouspos != bot.entity.position) {
			this.io.emit("pos", bot.entity?.position);
		}
		this.io.emit("xp.level", bot.experience.level);
	}
}

const myBot = new BotInstance("settings.json");

export { BotInstance, myBot };
