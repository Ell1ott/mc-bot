const http = require("http").createServer();
const mineflayer = require("mineflayer");
const inventoryViewer = require("mineflayer-web-inventory");
const autoeat = require("mineflayer-auto-eat").plugin;
const pvp = require("mineflayer-pvp").plugin;
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const { getCooldown } = require("mineflayer-pvp");
const fs = require("fs");
const { loadSettings, updateSetting, settings } = require("./settingstest.js");
const gui = require("mineflayer-gui");
const mineflayerViewer = require("prismarine-viewer").mineflayer;

var Convert = require("ansi-to-html");
var convert = new Convert();
// updateSetting("antiafk.sneaking.timebetweensneaks.1", 8);

// console.log(settings.antiafk.sneaking.timebetweensneaks[1]);
const { flipflopWithRandomDelay, loopWithRandomDelay } = require("./looper.js");

const io = require("socket.io")(http, {
	cors: { origin: "*" },
});

global.settings = settings;
function log(msg) {
	io.emit("log", msg);
	console.log(msg);
}
function alert(msg) {
	io.emit("alert", msg);
	console.warn(msg);
}
function info(msg) {
	io.emit("info", msg);
	console.info(msg);
}

console.log("starting bot");
let eldham = false;
let bot = joinStoneworks();
// let bot = joinLocalhost(process.argv[2]);

// let bot = joinCrackedServer();
const { warn } = require("console");
const { getSetting } = require("./settingHelper.js");

const { modules, asign } = require("./modules.js");

// const fishing = require("./modules/fishing.js");
// const autoattack = require("./modules/autoattack.js");
// const automine = require("./modules/automine.js");
// fishing.asign(bot, log, alert);
// autoattack.asign(bot, log, alert);
// automine.asign(bot, log, alert);
bot.loadPlugin(autoeat);
bot.autoEat.disable();
bot.loadPlugin(pvp);
bot.loadPlugin(pathfinder);
bot.loadPlugin(gui.plugin);
bot.loadPlugin(require("mineflayer-collectblock").plugin);

// load all custom utilities
// bot.loadPlugin(require("./utils/blockutils.js").plugin);
// bot.loadPlugin(require("./utils/entityutils.js").plugin);

const c = {
	log,
	info,
	alert,
};
asign(bot, c, settings);
inventoryViewer(bot);

function lookAtEntity() {
	let friend = bot.nearestEntity();

	if (friend) {
		bot.lookAt(friend.position.offset(0, friend.height, 0));
	}
}

itemCounterItems = [
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

enchantedBooks = [];
let runningloops = {};
let itemCounters = {};

itemCounterItems.forEach((item) => {
	itemCounters[item] = 0;
});

// require("./utils/blockutils.js")(bot);
function canCraft(recipe, crafting_table) {
	const input = recipe.inShape || recipe.ingredients;
	needsCraftingTable = input.length > 2 || input[0].length > 2;

	if (!crafting_table && needsCraftingTable) return false;
	let itemsNeeded = {};
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

function itemIdsToNames(ids) {
	return ids.map((x) => (!x ? null : bot.registry.items[x].name));
}

function itemNamefromid(id) {
	return bot.registry.items[id]?.name;
}

bot.registry.itemid;
function getAllPosibleRecipes() {
	const recipeItems = bot.registry.recipes;

	return Object.keys(recipeItems).filter((item) => canCraftItem(item, true));
}
// bot.autoEat.enable();

bot.once("spawn", () => {
	bot.autoEat.options.priority = "saturation";
	bot.autoEat.options.startAt = 19;
	bot.autoEat.options.bannedFood.push("golden_apple", "enchanted_golden_apple");
	io.emit("username", bot.username);
	// log(itemIdsToNames(getAllPosibleRecipes()));
	io.emit("craftableRecipes", getAllPosibleRecipes());

	mineflayerViewer(bot, { port: 2000 });
	if (eldham) {
		setTimeout(() => {
			new bot.gui.Query()
				.matchBy("display")
				.mouseButton("right")
				.clickItems("Server Selector", "Eldham");
		}, 1000);
	}

	function swichToEldham() {
		bot.setQuickBarSlot(2);

		bot.activateItem();

		bot.once("windowOpen", (window) => {
			console.log("window was opened");

			bot.clickWindow(3, 0, 0);
		});
	}
	// console.log(bot.world.getColumns()[1]);
	// // console.log(bot.world.getColumns()[10].column.sections.length);
	// console.log(
	//   bot.world.getColumns()[1].column.sections.map((o) => o.solidBlockCount)
	// );
	// log(bot.world.getColumns()[1].column.sections);
	// log(bot.world.getColumns()[1].column.sections[0].data.data.data);
	// // console.log(bot.world.getColumns()[1].column.sections[0]);

	// console.log(itemNamefromid(74));
	// getBlock(posInChunk(pos)
	// log(bot.world.raycast())

	// fishing.start();
});

bot.on("chat", (username, message) => {
	if (message === "fight me") {
		const player = bot.players[username];

		if (!player) {
			return;
		}

		bot.pvp.attack(player.entity);
	}

	if (message === "stop") {
		bot.pvp.stop();
	}
});

bot.on("playerCollect", (collector, collected) => {
	meta = collected.metadata[8];
	log(
		collector.username +
			" collocted " +
			meta?.itemCount +
			" " +
			itemNamefromid(meta?.itemId)
	);

	if (meta?.itemId === 1006 && collector.username === bot.username) {
		// if the item is a enchanted book

		const enchantments = meta.nbtData.value.StoredEnchantments.value.value;

		const enchanted_book = enchantments.map((e) => {
			return {
				name: e.id.value.replace("minecraft:", ""),
				lvl: e.lvl.value,
			};
		});

		enchantedBooks.push(enchanted_book);

		log(enchantedBooks);
		io.emit("enchantedbooks", enchantedBooks);
	}

	// log(collected.metadata[8]);

	if (collector === bot.entity) {
		itemName = itemNamefromid(collected.metadata[8]?.itemId);
		if (itemName in itemCounters) {
			itemCounters[itemName] += collected.metadata[8]?.itemCount;
			io.emit("updateItemCount." + itemName, itemCounters[itemName]);
			log("bot has collected " + itemCounters[itemName] + " " + itemName);
		}
	}
});

io.on("connection", (socket) => {
	socket.emit("username", bot.username);
	socket.emit("settings", settings);
	Object.entries(itemCounters).forEach(([itemName, count]) => {
		socket.emit("updateItemCount." + itemName, count);
	});
	console.log("a user is connected to io socket");
	// itemCounters.forEach((k, v) => )
	socket.on("message", (message) => {
		log(message);
	});
	socket.on("setting.set", updateSetting);
	socket.on("rot", (message) => {
		log("should now be rotating to ", message);
		bot.look((parseInt(message) / 180) * Math.PI, bot.entity.pitch);
	});

	socket.on("setControlState", (control, state) => {
		if (control == "jump" && autojump) return;
		bot.setControlState(control, state);
	});

	socket.on("lookAtEntity", (bool) => {
		if (bool) {
			bot.on("move", lookAtEntity);
			console.log("now looking at entity");
		} else {
			bot.removeListener("move", lookAtEntity);
		}
	});

	socket.on("sendchat", (chat) => {
		bot.chat(chat);
	});
	let autojump = false;

	socket.on("toggleModule", (module, on) => {
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
					bot.autoEat.enable();
					try {
						bot.autoEat.eat();
					} catch {}
				} else {
					bot.autoEat.disable();
				}
				break;

			case "antiafk":
				if (on) {
					console.log("snok ", settings.antiafk.sneaking.timebetweensneaks.val);
					runningloops.antiafk = [];
					if (getSetting(settings.antiafk.sneaking)) {
						stopSneak = flipflopWithRandomDelay(
							() => {
								bot.setControlState("sneak", true);
							},
							() => {
								bot.setControlState("sneak", false);
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
					bot.setControlState("sneak", false);
				}
				break;

			default:
				console.log("the module: " + module + " does not exist");
				break;
		}
	});
});

previouspos = undefined;

function updPlayerInfo() {
	if (!bot.entity) return;
	io.emit("health", bot.health);
	io.emit("food", bot.food);
	if (previouspos != bot.entity.position) {
		io.emit("pos", bot.entity?.position);
	}
	io.emit("xp.level", bot.experience.level);
}
setInterval(updPlayerInfo, 500);

bot.on("entityMoved", (entity) => {
	if (entity == bot.entity) {
		io.emit("YawRot", bot.entity.yaw);
	}
});

bot.on("chat", (username, msg) => {
	// io.emit("chat", { username: username, msg: msg });
});

bot.on("message", (message) => {
	// console.log(message.toAnsi());
	// log(convert.toHtml(message.toAnsi()));
	// io.emit("message", convert.toHtml(message.toAnsi()));
	io.emit("message", message.toString());
});

bot.on("kick", (reason) => {
	log("kicked: " + reason);
	io.emit("alert", "kicked from server");
});
bot.on("end", (reason) => {
	log("ended: " + reason);
	io.emit("alert", "disconnected from server");
});

bot.on("error", (err) => {
	log("error: " + err);
});

http.listen(6800, () => log("started on port 6800"));

function joinLocalhost(port) {
	return mineflayer.createBot({
		host: "localhost", // minecraft server ip
		username: "xaz", // minecraft username
		auth: "offline", // for offline mode servers, you can set this to 'offline'
		port: port, // only set if you need a port that isn't 25565
		version: "1.19.2", // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
		// password: '12345678'        // set if you want to use password-based auth (may be unreliable)
	});
}
function joinCrackedServer(ip = "blocksmc.com") {
	return mineflayer.createBot({
		host: ip, // minecraft server ip
		username: "xaz194011", // minecraft username
		auth: "offline", // for offline mode servers, you can set this to 'offline'
		// port: port, // only set if you need a port that isn't 25565
		version: "1.19.2", // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
		// password: '12345678'        // set if you want to use password-based auth (may be unreliable)
	});
}

function joinStoneworks() {
	eldham = true;
	return mineflayer.createBot({
		host: "play.stoneworks.gg", // minecraft server ip
		username: "", // minecraft username
		auth: "microsoft", // for offline mode servers, you can set this to 'offline'
		// port: 51812, // only set if you need a port that isn't 25565
		version: "1.19.2", // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
		// password: "12345678", // set if you want to use password-based auth (may be unreliable)
	});
}

bot.on("chat", (username, message) => {
	if (message === "fight") {
		const player = bot.players[username];

		if (!player) {
			return;
		}

		bot.pvp.attack(
			bot.nearestEntity((e) => e.type != "player" && e.type != "item")
		);
	}

	if (message === "stop") {
		bot.pvp.stop();
		clearInterval(attackLoop);
	}

	if (message === "attack") {
		// attackLoop = setInterval(async () => {}, 200);
		attacking = true;
		attack();
	}

	if (message === "recepy") {
	}
});
