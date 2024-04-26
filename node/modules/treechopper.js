const mineflayer = require("mineflayer");
// let bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settingHelper");
const { error } = require("console");
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalBlock } = require("mineflayer-pathfinder").goals;
const Vec3 = require("vec3").Vec3;
let c;
let settings;
/** @type {mineflayer.Bot} */
let bot;
let saplingBlock;

let bonemeal;
function asign(_bot, _c, _settings) {
  c = _c;
  settings = _settings;
  bot = _bot;
  bonemeal = bot.registry.itemsByName.bone_meal.id;
}

function findAxe() {
  return bot.inventory.items().find((item) => item.name.endsWith("axe"));
}
async function start() {
  // await placesaplings();
  // await growTree();
  // climbLadder(105);
  bot.equip(findAxe(), "hand");
  await chopTree();

  // await lookUpward();
}

function blockAbove(block, amount = 1) {
  return bot.blockAt(posAbove(block.position, amount));
}
function blockBelow(block, amount = 1) {
  return bot.blockAt(posAbove(block.position, -amount));
}
function posAbove(pos, amount = 1) {
  return pos.offset(0, amount, 0);
}

function isLog(block) {
  return block.name.endsWith("_log");
}

async function waittest() {
  await wait(3000);
}

async function lookUpward() {
  await bot.look(bot.entity.yaw, Math.PI * 0.3);
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const clampAround = (num, place, size) =>
  clamp(num, place - size, place + size);
const bbsize = 0.48;

function blockInFront(block) {
  const headPos = bot.entity.position.offset(0, bot.entity.height, 0);
  const range = headPos.distanceTo(block.position);
  const dir = block.position.offset(0.5, 0.5, 0.5).minus(headPos);
  const match = (inputBlock, iter) => {
    const intersect = iter.intersect(inputBlock.shapes, inputBlock.position);
    if (intersect) {
      return true;
    }
    return block.position.equals(inputBlock.position);
  };
  const blockAtCursor = bot.world.raycast(
    headPos,
    dir.normalize(),
    range,
    match
  );
  c.log(blockAtCursor);
  c.log(bot.blockAt(block.position));
  return blockAtCursor;
}
async function breakBlock(block, breakblockinfront) {
  let blockAtCursor = bot.blockAtCursor(5, null, true);
  while (bot.blockAt(block.position).name != "air") {
    console.log(bot.blockAt(block.position).name);

    while (!blockAtCursor?.position.equals(blockInFront(block).position)) {
      // console.log(console.log(bot.canSeeBlock(block)));
      // c.log(blockInFront(block));
      // const b = blockInFront(block);
      lookAtBlock(
        // new Vec3(
        //   clampAround(headpos().x, bpos.x, bbsize),
        //   clampAround(headpos().y, bpos.y, bbsize),
        //   clampAround(headpos().z, bpos.z, bbsize)
        // )
        block.position
      );

      await bot.waitForTicks(1);
      blockAtCursor = bot.blockAtCursor(5, null, true);
    }
    await bot.dig(blockAtCursor, "ignore", "raycast");

    if (blockAtCursor.position.equals(block.position)) return;
  }
  // await bot.waitForTicks(5);
}

function headpos() {
  return bot.entity.position.offset(0, bot.entity.height, 0);
}
async function chopTree() {
  let wood = bot.findBlock({
    matching: isLog,
    maxDistance: 5,
  });
  if (wood) {
    await breakBlock(wood);
    wood = blockAbove(wood);
    await breakBlock(wood);
    await wait(100);
    bot.setControlState("forward", true);
    while (bot.entity.position.xzDistanceTo(blockCenter(wood)) > 0.5) {
      await bot.waitForTicks(1);
    }

    bot.setControlState("forward", false);
    let woodabove = blockAbove(wood);
    wood = bot.blockAtCursor(5);
    await wait(200);
    await lookUpward();
    await bot.dig(woodabove, "ignore", "raycast");
    for (let i = 0; i < 50; i++) {
      await breakBlock(wood);
      wood = blockAbove(wood);
      await breakBlock(wood);
      wood = blockAbove(wood);
      await breakBlock(wood);

      if (!isLog(wood)) {
        c.info("got to the top of tree");
        break;
      }
      bot.setControlState("forward", true);
      bot.setControlState("jump", true);
      await bot.waitForTicks(1);
      bot.setControlState("jump", false);
      while (bot.entity.position.xzDistanceTo(blockCenter(wood)) > 0.3) {
        await bot.waitForTicks(1);
      }
      bot.setControlState("forward", false);
      if (woodabove.position.x === wood.position.x) {
        woodabove = wood;
        wood = bot.blockAt(wood.position.offset(1, -1, 0));
        if (!isLog(wood)) {
          wood = bot.blockAt(wood.position.offset(-2, 0, 0));
        }
      } else {
        woodabove = wood;
        wood = bot.blockAt(wood.position.offset(0, -1, 1));
        if (!isLog(wood)) {
          wood = bot.blockAt(wood.position.offset(0, 0, -2));
        }
      }
    }

    const lastwood = bot.findBlocks({
      matching: (block) => isLog(block),
      useExtraInfo: (block) => block.position.y >= bot.entity.position.y,
      count: 20,
      maxDistance: 8,
    });

    for (const blockpos of lastwood) {
      wood = bot.blockAt(blockpos);
      await breakBlock(wood);
    }

    await wait(300);

    console.log(saplingBlock);

    bot.setControlState("sneak", true);
    await bot.lookAt(
      new Vec3(
        saplingBlock.position.x - 1,
        bot.entity.position.y,
        saplingBlock.position.z - 1
      )
    );

    bot.setControlState("forward", true);
    await wait(500);
    bot.setControlState("forward", false);

    let y = bot.entity.position.y - 1;
    wood = bot.findBlock({
      matching: isLog,
      maxDistance: 8,
      useExtraInfo: (block) => block.position.y == y,
    });

    while (wood) {
      console.log(y);
      await breakBlock(wood);
      y -= 1;
      wood = bot.findBlock({
        matching: isLog,
        maxDistance: 8,
        useExtraInfo: (block) => block.position.y == y,
      });
      console.log(wood);
    }
    wood = bot.findBlock({
      matching: isLog,
      maxDistance: 8,
    });
    while (wood) {
      await breakBlock(wood);
      wood = bot.findBlock({
        matching: isLog,
        maxDistance: 8,
      });
    }
    bot.setControlState("sneak", false);
    await wait(300);

    await walkToPos(saplingBlock.position.offset(1.5, 1, 1.5));
  }
}

async function walkToPos(pos, continuesLooking = true, precision = 0.5) {
  await bot.lookAt(pos);
  bot.setControlState("forward", true);
  while (bot.entity.position.xzDistanceTo(pos) > precision) {
    if (continuesLooking) {
      bot.lookAt(pos);
    }
    await bot.waitForTicks(1);
  }
  bot.setControlState("forward", false);
  await bot.waitForTicks(1);
}

faces = {
  north: { x: 0, z: -0.5, y: 0 },
  east: { x: 0.5, z: 0, y: 0 },
  south: { x: 0, z: 0.5, y: 0 },
  west: { x: -0.5, z: 0, y: 0 },
};

function multiply(vec3, factor) {
  return vec3.multiply({ x: factor, y: factor, z: factor });
}

async function climbLadder(desiredY) {
  const defaultMove = new Movements(bot);
  const ladder = bot.findBlock({
    matching: bot.registry.blocksByName.ladder.id,
  });

  // c.log(ladder);

  function onMoveClimb() {
    console.log(bot.canSeeBlock(ladder));
    if (bot.canSeeBlock(ladder)) {
      bot.setControlState("left", true);
    } else {
      bot.setControlState("left", false);
    }

    lookAtBlock(ladder.position.minus(faces[ladder._properties.facing]));

    if (bot.entity.position.y >= desiredY) {
      bot.setControlState("forward", false);
      bot.removeListener("move", onMoveClimb);
    }
  }
  // bot.on("move", onMoveClimb);

  // bot.setControlState("forward", true);

  bot.pathfinder.setMovements(defaultMove);
  const p = ladder.position
    .plus(faces[ladder._properties.facing])
    .plus(faces[ladder._properties.facing]);
  bot.pathfinder.goto(new GoalBlock(p.x, p.y, p.z)).then(async () => {
    console.log("want to ladder");
    // bot.setControlState("sprint", true);
    await lookAtBlock(ladder.position.minus(faces[ladder._properties.facing]));
    bot.setControlState("forward", true);
  });
}
function blockCenter(block) {
  return block.position.offset(0.5, 0.5, 0.5);
}

async function lookAtBlock(blockpos) {
  await bot.lookAt(blockpos.offset(0.5, 0.5, 0.5));
}
async function growTree() {
  bot.equip(bonemeal, "hand");
  await lookAtBlock(saplingBlock.position);
  while (bot.blockAt(saplingBlock.position).name.endsWith("sapling")) {
    bot.activateBlock(saplingBlock);
    await wait(500);
  }
}
function stop() {}

async function placesaplings() {
  const saplings = findSaplings();
  if (saplings) {
    bot.equip(saplings, "hand");
    const block = findTreePlace();
    console.log(block);

    if (block) {
      saplingBlock = bot.blockAt(block.position.offset(0, 1, 0));
      for (let a = 0; a < 2; a++) {
        for (let b = 0; b < 2; b++) {
          await wait(200);
          await lookAtBlock(block.position.offset(-a, 1, -b));
          await wait(200);
          await bot.placeBlock(bot.blockAt(block.position.offset(-a, 0, -b)), {
            x: 0,
            y: 1,
            z: 0,
          });
        }
      }
    }
  } else {
    c.info("no more saplings :(");
  }
}

const acceptedBlocks = ["podzol", "grass_block", "dirt"];

function findSaplings() {
  return bot.inventory.items().find((i) => i.name.endsWith("sapling"));
}

function isBlockAccepted(block) {
  const pos = block.position;

  if (!saplingPlaceble(bot.blockAt(pos.offset(-1, 0, 0)))) return false;
  if (!saplingPlaceble(bot.blockAt(pos.offset(0, 0, -1)))) return false;
  if (!saplingPlaceble(bot.blockAt(pos.offset(-1, 0, -1)))) return false;
  return true;
}

function saplingPlaceble(block) {
  if (block.position) {
    const bAbove = blockAbove(block).name;
    if (bAbove !== "air" && bAbove !== "grass") {
      return false;
    }
  }
  return acceptedBlocks.includes(block.name);
}

function findTreePlace() {
  return bot.findBlock({
    matching: saplingPlaceble,
    useExtraInfo: isBlockAccepted,
    maxDistance: 5,
  });
}

module.exports = {
  asign,
  start,
  stop,
};
