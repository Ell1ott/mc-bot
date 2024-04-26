const mineflayer = require("mineflayer");
// let bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settingHelper");

let c;
let settings;
let mSettings;

/** @type {mineflayer.Bot} */
let bot;

function asign(_bot, _c, _settings) {
  bot = _bot;
  c = _c;

  settings = _settings;
  mSettings = settings.mode.modes;
  bot.on("blockUpdate", async () => {
    if (isDigging && mSettings.straight.cancelWhenBlockInFront.val) {
      if (!block) return;
      if (
        bot.blockAtCursor(5)?.position.x != block.position.x ||
        bot.blockAtCursor(5)?.position.y != block.position.y ||
        bot.blockAtCursor(5)?.position.z != block.position.z
      ) {
        bot.stopDigging();
        console.log(bot.blockAtCursor(5)?.position, block.position);
        // await wait(100);

        // dig();
      }
    }
  });
}
isDigging = false;

let pPitch = Math.PI / 2;
async function start() {
  switch (settings.mode.val) {
    case "straight":
      pPitch = bot.entity.pitch;
      if (mSettings.straight.lookstraight.val)
        await bot.look(bot.entity.yaw, 0);
      isDigging = true;
      dig();
      break;
    case "strip_mining":
      startStripMining();
      break;
  }
}
let block;
async function dig() {
  if (!isDigging) return;

  block = bot.blockAtCursor(5);

  if (!block) {
    await wait(100);
  } else {
    try {
      await bot.dig(block, "ignore", "raycast"); // 2nd param: true to 'snap at block' or 'ignore' to just not turn head
    } catch {}
  }
  await dig();
}

async function stop() {
  isDigging = false;
  bot.stopDigging();
  if (!mSettings.straight.lookstraight.val) return;
  await bot.look(bot.entity.yaw, pPitch);
}

async function lookAtBlock(block) {
  await bot.lookAt(block.position.plus({ x: 0.5, y: 0.5, z: 0.5 }));
}

const sides = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 1, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 },
];

async function collectVein(block) {
  for (const side of sides) {
    const b = bot.blockAt(block.position.plus(side));
    if (veinBlocks.includes(b.name)) {
      // await mineBlock(bot.blockAt(block.position.plus(side)));
      await bot.collectBlock.collect(b);
      await collectVein(b);
    }
  }
}
const veinBlocks = ["iron_ore", "gold_ore"];
async function mineBlock(block) {
  await lookAtBlock(block);
  await bot.dig(block, "ignore", "raycast");
  await collectVein(block);
}
async function startStripMining() {
  console.log("started strip mining");
  const dir = { x: 3, y: 1, z: 0 };
  while (true) {
    const grass = bot.findBlock({
      matching: bot.registry.blocksByName.oak_log.id,
      maxDistance: 64,
    });
    if (grass) {
      // If we found one, collect it.
      try {
        await bot.collectBlock.collect(grass);
        // collectGrass(); // Collect another grass block
      } catch (err) {
        console.log(err); // Handle errors, if any
      }
    }
    await wait(500);
  }
  return;

  // await bot.lookAt(bot.entity.position.add({ x: 2, y: 2, z: 2 }));
  // await bot.lookAt(bot.entity.position.add({ x: 2, y: 2, z: 2 }));
  await bot.lookAt(bot.entity.position.plus(dir));
  console.log("looked");

  let f = false;

  while (true) {
    for (let i = 0; i < 4; i++) {
      block = bot.blockAt(bot.entity.position.plus({ x: i, y: 1, z: 0 }));
      // console.log(block.name);
      if (block.type !== 0) {
        bot.setControlState("forward", false);

        await mineBlock(block);
      }
      block = bot.blockAt(bot.entity.position.plus({ x: i, y: 0, z: 0 }));
      if (block.type !== 0) {
        bot.setControlState("forward", false);
        await mineBlock(block);
      }
    }

    bot.setControlState("forward", true);
    await wait(100);
  }

  while (false) {
    block = bot.blockAtCursor(5);
    if (block) {
      console.log("found block");
      if (
        block.position.y === bot.entity.position.y ||
        block.position.y === bot.entity.position.y + 1
      ) {
        bot.setControlState("forward", false);
        f = false;
        await bot.dig(block, "ignore", "raycast");
        await wait(200);

        continue;
      }
    }
    if (!f) {
      bot.setControlState("forward", true);
      f = true;
    }
    await wait(100);
  }

  // await bot.look(0, 0);
}

module.exports = {
  asign,
  start,
  stop,
};
