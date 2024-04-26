const mineflayer = require("mineflayer");
// let bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settingHelper");

let c;
let settings;
/** @type {mineflayer.Bot} */
let bot;

function asign(_bot, _c, _settings) {
  c = _c;
  settings = _settings;
  bot = _bot;
}

function start() {}

function stop() {}

module.exports = {
  asign,
  start,
  stop,
};
