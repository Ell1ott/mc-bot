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
function playerJoined(player) {
  if (!settings.playerjoin.enabled) return;
  if (settings.playerjoin.val.includes(player.username)) {
    bot.quit();
    c.info("left beacuse " + player.username + " joined");
  }
}

function healthChange() {
  if (settings.health.enabled && bot.health < settings.health.val) {
    bot.quit();
    c.info("left beacuse health got below " + settings.health.val);
    return;
  }
  if (settings.food.enabled && bot.food < settings.food.val) {
    bot.quit();
    c.info("left beacuse food got below " + settings.food.val);

    return;
  }
}

function entityMoved(e) {
  if (!settings.player_too_close.enabled) return;
  // console.log();
  if (e.type !== "player") return;
  const dis = bot.entity.position.distanceTo(e.position);
  if (
    settings.player_too_close.players.val.some(
      (item) => item.toLowerCase() === e.username.toLowerCase()
    )
  ) {
    if (!settings.player_too_close.specifiedplayerdistance.enabled) return;
    if (dis < settings.player_too_close.specifiedplayerdistance.val[0]) {
      bot.quit();
      bot.removeListener("entityMoved", entityMoved);

      c.info("left beacuse " + e.username + " got too close");
    }
    return;
  } else if (dis < settings.player_too_close.otherplayerdistance.val[0]) {
    if (!settings.player_too_close.otherplayerdistance.enabled) return;
    bot.quit();
    bot.removeListener("entityMoved", entityMoved);

    c.info("left beacuse " + e.username + " got too close");
    return;
  }
}
function start() {
  bot.on("playerJoined", playerJoined);
  bot.on("health", healthChange);
  bot.on("entityMoved", entityMoved);
}

function stop() {
  bot.removeListener("playerJoined", playerJoined);
  bot.removeListener("health", healthChange);
  bot.removeListener("entityMoved", entityMoved);
}

module.exports = {
  asign,
  start,
  stop,
};
