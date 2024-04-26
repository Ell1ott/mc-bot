const mineflayer = require("mineflayer");
// let bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settingHelper");
const { randomBytes } = require("crypto");

let c;
let settings;
/** @type {mineflayer.Bot} */
let bot;

function asign(_bot, _c, _settings) {
  c = _c;
  settings = _settings;
  bot = _bot;
}

let containers = [];

let startingRot;

let isRunning;
function start() {
  startingRot = { yaw: bot.entity.yaw, pitch: bot.entity.pitch };
  containers = findContainers(
    global.settings.fishing.storeaway.storageblocks.val
  );
  startFishing();
  isRunning = true;
  // legitLoop();
}

function stop() {
  stopFishing();
  isRunning = false;
}

async function legitLoop() {
  if (settings.headrot.val) {
    // await wait(Math.random() * 2000);
    await bot.look(
      startingRot.yaw + Math.random() * 0.5 - 0.25,
      startingRot.pitch + Math.random() * 0.5 - 0.25
    );
    if (isRunning) legitLoop();
  }
}

let nowFishing = false;

// : mineflayer.bot
async function startFishing() {
  // c.log("Fishing");
  c.log("fishing");

  try {
    const fishing_rod_in_hotbar = bot.inventory
      .items()
      .find((item) => item.name == "fishing_rod" && item.slot > 35);

    if (fishing_rod_in_hotbar) {
      bot.setQuickBarSlot(fishing_rod_in_hotbar.slot - 36);
    } else {
      if (settings.takefrominventory.val) {
        const fishing_rod = bot.inventory
          .items()
          .find((item) => item.name == "fishing_rod");
        if (fishing_rod) {
          await wait(200);
          bot.equip(fishing_rod);
          c.info("took fishing rod from inventory");
          await wait(200);
        } else {
          c.alert("no fishing rod in inventory");
          return;
        }
      } else {
        c.alert("no fishing rod in hotbar");
        return;
      }
    }
  } catch (err) {
    return c.log(err.message);
  }

  nowFishing = true;
  if (isInventoryFull(false) && settings.storeaway.enabled) {
    pYaw = bot.entity.yaw;
    pPitch = bot.entity.pitch;
    await dumpInChest(true);

    await bot.look(pYaw, pPitch);
  }
  // bot.on("playerCollect", onCollect);

  try {
    swing();
    await bot.fish(400, global.settings.fishing.swing).then(() => {
      setTimeout(() => {
        startFishing();
      }, 1000);
    });
  } catch (err) {
    c.log(err.message);
  }
  nowFishing = false;
}
function findContainers(blocks = []) {
  const chestToOpen = bot.findBlocks({
    matching: blocks.map((name) => bot.registry.blocksByName[name].id),
    maxDistance: 6,
    count: 10,
  });
  if (!chestToOpen) {
    c.log("no chest found");
    return [];
  }

  c.log(chestToOpen);
  c.log(chestToOpen[0]);

  return chestToOpen;
}
async function dumpInChest(excludeHotbar, excludeItems = []) {
  if (containers.length == 0) {
    c.alert("no more containers with space in them");
    return;
  }

  let chestToOpen = bot.blockAt(containers[0]);
  await wait(100);
  await bot.lookAt(chestToOpen.position);
  await wait(100);
  let chest;

  try {
    chest = await bot.openContainer(chestToOpen);
  } catch {
    containers.shift();
    await dumpInChest(excludeHotbar, excludeItems);
    return;
  }
  spaceLeft = containerSpace(chest) - chest.containerItems().length;
  for (slot of bot.inventory.slots) {
    if (
      slot &&
      !excludeItems.includes(slot.name) &&
      (!excludeHotbar || slot.slot < 36) &&
      slot.slot > 8
    ) {
      if (spaceLeft == 0) {
        c.log("container at " + chestToOpen.position + " is full");
        await wait(200);
        chest.close();
        containers.shift();
        await dumpInChest(excludeHotbar, excludeItems);
        return;
      }
      await chest.deposit(slot.type, null, slot.count);
      console.log(
        getSetting(global.settings.fishing.storeaway.storeitemdelay, true, true)
      );
      await wait(
        getSetting(global.settings.fishing.storeaway.storeitemdelay, true, true)
      );

      spaceLeft = containerSpace(chest) - chest.containerItems().length;
    }
  }

  chest.close();
}

function containerSpace(container) {
  return (
    container.slots.length - (container.inventoryEnd - container.inventoryStart)
  );
}

function isInventoryFull(excludeHotbar) {
  const items = bot.inventory.items();
  if (!excludeHotbar) {
    return items.length == 36;
  }
  let count = 0;
  items.forEach((item) => {
    if (item.slot < 36) count++;
  });
  return count == 27;
}

function swing() {
  if (global.settings.fishing.swing) {
    bot.swingArm("right");
  }
}

function stopFishing() {
  // bot.removeListener("playerCollect", onCollect);

  if (nowFishing) {
    swing();
    bot.activateItem();
    nowFishing = false;
  }
}

module.exports = {
  asign,
  start,
  stop,
  nowFishing,
};
