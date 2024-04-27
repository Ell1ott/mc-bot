const autoeat = require("mineflayer-auto-eat").plugin;

const pvp = require("mineflayer-pvp").plugin;
const { pathfinder } = require("mineflayer-pathfinder");
const { getCooldown } = require("mineflayer-pvp");
import { loadSettings, updateSetting, settings } from "./settingstest";

const gui = require("mineflayer-gui");
const mineflayerViewer = require("prismarine-viewer").mineflayer;

var Convert = require("ansi-to-html");
var convert = new Convert({ escapeXML: true });
const { flipflopWithRandomDelay } = require("./looper.js");

const { getSetting } = require("./settingHelper.js");
import mineflayer, { BotEvents, Furnace } from "mineflayer";

import { EventEmitter } from "events";
import { Module } from "./modules/module";
import { Fishing } from "./modules/fishing";
import { getAllPosibleRecipes, itemNamefromid, lookAtEntity } from "./botUtils";
import { Socket } from "socket.io";
// inventoryViewer(bot);

const itemCounterItems = [
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
import { EventEmitter2 } from "eventemitter2";

class BotInstance {
	bot: mineflayer.Bot | null;
	io: EventEmitter2;
	settings = {};
	modules: Record<string, Module> = {};
	client = new EventEmitter();

	clientBotBinds: Record<
		string,
		{ event: keyof BotEvents; func: BotEvents[keyof BotEvents] }[]
	> = {};

	chatHistory: { type: string; msg: string }[] = [];
	itemCounters = {};
	previouspos: any = null;
	updPlayerLoop = null;
	runningloops = { antiafk: [] as any[] };
	enchantedBooks = [] as any[];

	loopsForClient: Record<string, NodeJS.Timeout[]> = {};

	constructor(settingsPath) {
		this.bot = null;
		this.settings = loadSettings(settingsPath);
		this.io = new EventEmitter2();

		itemCounterItems.forEach((item) => {
			this.itemCounters[item] = 0;
		});
	}

	joinLocalhost(
		port: number,
		username = "Bot",
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
		this.bot.loadPlugin(pvp);
		this.bot.loadPlugin(pathfinder);
		this.bot.loadPlugin(gui.plugin);
		this.bot.loadPlugin(require("mineflayer-collectblock").plugin);
	}

	loadModules() {
		if (!this.bot) return;

		console.log("loading modules");

		this.modules = { fishing: new Fishing(this, "fishing") };
	}

	start() {
		if (!this.bot) return;
		this.loadPlugins();
		this.loadModules();
		this.initClientBinds();
		this.bot.on("kicked", (reason) => {
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

		this.bot.on("message", (message) => {
			this.log("chat: " + message.toAnsi());
			this.chatHistory.push({
				type: "message",
				msg: convert.toHtml(message.toAnsi()),
			});
		});

		this.bot.once("spawn", () => {
			if (!this.bot) return;
			(this.bot as any).autoEat.disable();
			(this.bot as any).autoEat.options.priority = "saturation";
			(this.bot as any).autoEat.options.startAt = 19;
			(this.bot as any).autoEat.options.bannedFood.push(
				"golden_apple",
				"enchanted_golden_apple"
			);
			this.io?.emit("username", this.bot.username);

			this.io?.emit("craftableRecipes", getAllPosibleRecipes(this.bot));

			mineflayerViewer(this.bot, { port: 2001 });
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

				this.enchantedBooks.push(enchanted_book);

				this.log(this.enchantedBooks);
				this.io?.emit("enchantedbooks", this.enchantedBooks);
			}

			// this.log(collected.metadata[8]);

			if (collector === this.bot?.entity) {
				if (!this.bot) return;

				const itemName = itemNamefromid(
					collected.metadata[8]?.itemId,
					this.bot
				);
				if (itemName in this.itemCounters) {
					this.itemCounters[itemName] += collected.metadata[8]?.itemCount;
					this.io?.emit(
						"updateItemCount." + itemName,
						this.itemCounters[itemName]
					);
					this.log(
						"bot has collected " + this.itemCounters[itemName] + " " + itemName
					);
				}
			}
		});
	}

	_lookAtEntity() {
		if (this.bot) lookAtEntity(this.bot);
	}

	initClientBinds() {
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
				this.bot?.on("move", this._lookAtEntity);
				console.log("now looking at entity");
			} else {
				this.bot?.removeListener("move", this._lookAtEntity);
			}
		});

		this.client.on("sendchat", (chat) => {
			this.bot?.chat(chat);
		});
		let autojump = false;

		this.client.on("toggleModule", (module, on) => {
			on = !on; // for some reason its flipped
			console.log(module + ".enabled", on);

			if (module in this.modules) {
				if (on) this.modules[module].start();
				else this.modules[module].stop();
			}

			updateSetting(module + ".enabled", on);
			switch (module) {
				case "autoeat":
					if (on) {
						(this.bot as any)?.autoEat.enable();

						(this.bot as any)?.autoEat
							// Setting to true will use offhand slot
							.eat(true)
							.catch((error) => {
								console.log("could not eat");
							});
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
						this.runningloops.antiafk = [];
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
							this.runningloops.antiafk.push(stopSneak);
						}

						console.log(settings.antiafk.sneaking.sneakinglength.val);
					} else {
						// stopSneak();
						this.runningloops.antiafk.forEach((func) => {
							func();
						});
						this.bot?.setControlState("sneak", false);
					}
					break;

				default:
					if (!(module in this.modules))
						console.log("the module: " + module + " does not exist");
					break;
			}
		});
	}

	botBindForClient<E extends keyof BotEvents>(
		socket: Socket,
		event: E,
		func: BotEvents[E]
	) {
		if (!this.bot) return;
		if (this.clientBotBinds[socket.id])
			this.clientBotBinds[socket.id].push({ event, func });
		else this.clientBotBinds[socket.id] = [];

		this.bot.on(event, func);
		this.clientBotBinds[socket.id] = this.clientBotBinds[socket.id] || [];
		this.clientBotBinds[socket.id].push({ event, func });
	}

	clientConnect(socket: Socket) {
		if (!this.bot) return;
		this.loopsForClient[socket.id] = [];

		socket.emit("username", this.bot.username);
		socket.emit("settings", settings);
		socket.emit("chatHistory", this.chatHistory);
		Object.entries(this.itemCounters).forEach(([itemName, count]) => {
			socket.emit("updateItemCount." + itemName, count);
		});

		socket.id;

		this.botBindForClient(socket, "entityMoved", (entity) => {
			if (entity == this.bot?.entity) {
				socket.emit("YawRot", this.bot?.entity.yaw);
			}
		});

		this.botBindForClient(socket, "message", (message) => {
			socket.emit("message", convert.toHtml(message.toAnsi()));
		});

		this.botBindForClient(socket, "health", () => {
			socket.emit("health", this.bot?.health);
			socket.emit("food", this.bot?.food);
		});

		this.botBindForClient(socket, "experience", () => {
			socket.emit("xp.level", this.bot?.experience.level);
		});

		this.loopsForClient[socket.id].push(
			setInterval(() => this.updPlayerInfo(), 1000)
		);

		// this.itemCounters.forEach((k, v) => )
	}

	clientDisconnect(socket: Socket) {
		if (!this.bot) return;
		this.clientBotBinds[socket.id].forEach((bind) => {
			this.bot?.off(bind.event, bind.func);
		});
	}

	log(msg) {
		this.io?.emit("log", msg);
		console.log(msg);
	}
	alert(msg) {
		console.warn(msg);
		this.io.emit("alert", msg);
	}
	info(msg) {
		this.io?.emit("info", msg);
		console.info(msg);
	}

	updPlayerInfo() {
		if (!this.bot?.entity || !this.io) return;

		if (
			this.previouspos?.x !== this.bot.entity.position.x ||
			this.previouspos?.y !== this.bot.entity.position.y ||
			this.previouspos?.z !== this.bot.entity.position.z
		) {
			this.io.emit("pos", this.bot.entity?.position);
			this.previouspos = this.bot.entity.position;
		}
	}
}

export { BotInstance };
