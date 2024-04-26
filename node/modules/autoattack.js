const mineflayer = require("mineflayer");
// let bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settingHelper");
const { getCooldown } = require("mineflayer-pvp");

let c;
let settings;
/** @type {mineflayer.Bot} */
let bot;

function asign(_bot, _c, _settings) {
  c = _c;
  settings = _settings;
  bot = _bot;
}

let attacking = false;

function start() {
  attacking = true;
  attack();
}

function stop() {
  attacking = false;
}
// let attackLoop = null;

async function attack() {
  let target = bot.nearestEntity(
    (e) => e.type === "mob" || e.type === "player"
  );
  if (!target) {
    setTimeout(attack, 100);
    return;
  }

  let pos = target.position.offset(0, target.height, 0);

  if (pos.distanceTo(bot.entity.position.offset(0, bot.entity.height, 0)) > 3) {
    setTimeout(attack, 100);
    return;
  }
  if (getSetting(global.settings.autoattack.rotation)) {
    bot.lookAt(pos, false);
  }
  // bot.lastSentYaw;

  bot.hello = "hej";

  if (
    bot.entityAtCursor(3.5, true) === target ||
    !getSetting(global.settings.autoattack.onlywhenlooking)
  ) {
    bot.attack(target);
  }
  // bot.attack(entity);
  const heldItem = bot.inventory.slots[bot.getEquipmentDestSlot("hand")];
  // await bot.waitForTicks(30);
  await bot.waitForTicks(getCooldown(heldItem?.name));
  // console.log(heldItem?.name);

  if (!attacking) return;
  setTimeout(attack, 100);
  // setTimeout(attack, 1000);
}
module.exports = {
  asign,
  start,
  stop,
};
