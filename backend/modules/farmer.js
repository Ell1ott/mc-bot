const mineflayer = require("mineflayer");
// let bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settings/settingHelper");

let c;
let settings;
/** @type {mineflayer.Bot} */
let bot;

let ids = {};
function asign(_bot, _c, _settings) {
	c = _c;
	settings = _settings;
	bot = _bot;
	ids.wheat = bot.registry.itemsByName["wheat"].id;
}

function start() {
	block = bot.findBlock({
		matching: ids.wheat,
	});

	c.log(block);
}

function isGrown(block) {}

function stop() {}

module.exports = {
	asign,
	start,
	stop,
};
