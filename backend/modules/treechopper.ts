import { Block } from "prismarine-block";
import { Module } from "./module";

const mineflayer = require("mineflayer");
// let this.bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settingHelper");
const { error } = require("console");
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalBlock } = require("mineflayer-pathfinder").goals;
const Vec3 = require("vec3").Vec3;

class TreeChopper extends Module {
	saplingBlock;

	bonemeal;
	static ModuleName = "treechopper";

	findAxe() {
		return this.bot.inventory.items().find((item) => item.name.endsWith("axe"));
	}
	async start() {
		// await placesaplings();
		// await growTree();
		// climbLadder(105);
		const axe = this.findAxe();
		if (!axe) {
			this.alert("No axe found");
			return;
		}
		this.bot.equip(axe, "hand");
		await this.chopTree();

		// await lookUpward();
	}

	blockAbove(block, amount = 1) {
		return this.bot.blockAt(this.posAbove(block.position, amount));
	}
	blockBelow(block, amount = 1) {
		return this.bot.blockAt(this.posAbove(block.position, -amount));
	}
	posAbove(pos, amount = 1) {
		return pos.offset(0, amount, 0);
	}

	isLog(block) {
		return block.name.endsWith("_log");
	}

	async waittest() {
		await wait(3000);
	}

	async lookUpward() {
		await this.bot.look(this.bot.entity.yaw, Math.PI * 0.3);
	}
	static clamp = (num, min, max) => Math.min(Math.max(num, min), max);
	static clampAround = (num, place, size) =>
		TreeChopper.clamp(num, place - size, place + size);
	static bbsize = 0.48;

	blockInFront(block) {
		const headPos = this.bot.entity.position.offset(
			0,
			this.bot.entity.height,
			0
		);
		const range = headPos.distanceTo(block.position);
		const dir = block.position.offset(0.5, 0.5, 0.5).minus(headPos);
		const match = (inputBlock, iter) => {
			const intersect = iter.intersect(inputBlock.shapes, inputBlock.position);
			if (intersect) {
				return true;
			}
			return block.position.equals(inputBlock.position);
		};
		const blockAtCursor = this.bot.world.raycast(
			headPos,
			dir.normalize(),
			range
		);
		this.log(blockAtCursor);

		this.log(this.bot.blockAt(block.position) + "");
		return blockAtCursor;
	}
	async breakBlock(block: Block | null) {
		if (!block) return;

		// We override the blockAtCursor function so it does have 3 args
		let blockAtCursor = this.bot.blockAtCursor(5, null, true);
		while (this.bot.blockAt(block.position)?.name != "air") {
			console.log(this.bot.blockAt(block.position)?.name);

			while (
				!blockAtCursor?.position.equals(this.blockInFront(block).position)
			) {
				// console.log(console.log(this.bot.canSeeBlock(block)));
				// this.log(blockInFront(block));
				// const b = blockInFront(block);
				this.lookAtBlock(
					// new Vec3(
					//   clampAround(headpos().x, bpos.x, bbsize),
					//   clampAround(headpos().y, bpos.y, bbsize),
					//   clampAround(headpos().z, bpos.z, bbsize)
					// )
					block.position
				);

				await this.bot.waitForTicks(1);
				blockAtCursor = this.bot.blockAtCursor(5, null, true);
			}
			await this.bot.dig(blockAtCursor, "ignore", "raycast");

			if (blockAtCursor.position.equals(block.position)) return;
		}
		// await this.bot.waitForTicks(5);
	}

	headpos() {
		return this.bot.entity.position.offset(0, this.bot.entity.height, 0);
	}
	async chopTree() {
		let wood = this.bot.findBlock({
			matching: this.isLog,
			maxDistance: 5,
		});
		if (wood) {
			await this.breakBlock(wood);
			wood = this.blockAbove(wood);
			await this.breakBlock(wood);
			await wait(100);
			this.bot.setControlState("forward", true);
			while (
				this.bot.entity.position.xzDistanceTo(this.blockCenter(wood)) > 0.5
			) {
				await this.bot.waitForTicks(1);
			}

			this.bot.setControlState("forward", false);
			let woodabove = this.blockAbove(wood);
			wood = this.bot.blockAtCursor(5);
			await wait(200);
			await this.lookUpward();
			await this.bot.dig(woodabove, "ignore", "raycast");
			for (let i = 0; i < 50; i++) {
				await this.breakBlock(wood);
				wood = this.blockAbove(wood);
				await this.breakBlock(wood);
				wood = this.blockAbove(wood);
				await this.breakBlock(wood);

				if (!this.isLog(wood)) {
					this.info("got to the top of tree");
					break;
				}
				this.bot.setControlState("forward", true);
				this.bot.setControlState("jump", true);
				await this.bot.waitForTicks(1);
				this.bot.setControlState("jump", false);
				while (
					this.bot.entity.position.xzDistanceTo(this.blockCenter(wood)) > 0.3
				) {
					await this.bot.waitForTicks(1);
				}
				this.bot.setControlState("forward", false);
				if (woodabove.position.x === wood.position.x) {
					woodabove = wood;
					wood = this.bot.blockAt(wood.position.offset(1, -1, 0));
					if (!this.isLog(wood)) {
						wood = this.bot.blockAt(wood.position.offset(-2, 0, 0));
					}
				} else {
					woodabove = wood;
					wood = this.bot.blockAt(wood.position.offset(0, -1, 1));
					if (!this.isLog(wood)) {
						wood = this.bot.blockAt(wood.position.offset(0, 0, -2));
					}
				}
			}

			const lastwood = this.bot.findBlocks({
				matching: (block) => this.isLog(block),
				useExtraInfo: (block) => block.position.y >= this.bot.entity.position.y,
				count: 20,
				maxDistance: 8,
			});

			for (const blockpos of lastwood) {
				wood = this.bot.blockAt(blockpos);
				await this.breakBlock(wood);
			}

			await wait(300);

			console.log(this.saplingBlock);

			this.bot.setControlState("sneak", true);
			await this.bot.lookAt(
				new Vec3(
					this.saplingBlock.position.x - 1,
					this.bot.entity.position.y,
					this.saplingBlock.position.z - 1
				)
			);

			this.bot.setControlState("forward", true);
			await wait(500);
			this.bot.setControlState("forward", false);

			let y = this.bot.entity.position.y - 1;
			wood = this.bot.findBlock({
				matching: this.isLog,
				maxDistance: 8,
				useExtraInfo: (block) => block.position.y == y,
			});

			while (wood) {
				console.log(y);
				await this.breakBlock(wood);
				y -= 1;
				wood = this.bot.findBlock({
					matching: this.isLog,
					maxDistance: 8,
					useExtraInfo: (block) => block.position.y == y,
				});
				console.log(wood);
			}
			wood = this.bot.findBlock({
				matching: this.isLog,
				maxDistance: 8,
			});
			while (wood) {
				await this.breakBlock(wood);
				wood = this.bot.findBlock({
					matching: this.isLog,
					maxDistance: 8,
				});
			}
			this.bot.setControlState("sneak", false);
			await wait(300);

			await this.walkToPos(this.saplingBlock.position.offset(1.5, 1, 1.5));
		}
	}

	async walkToPos(pos, continuesLooking = true, precision = 0.5) {
		await this.bot.lookAt(pos);
		this.bot.setControlState("forward", true);
		while (this.bot.entity.position.xzDistanceTo(pos) > precision) {
			if (continuesLooking) {
				this.bot.lookAt(pos);
			}
			await this.bot.waitForTicks(1);
		}
		this.bot.setControlState("forward", false);
		await this.bot.waitForTicks(1);
	}

	faces = {
		north: { x: 0, z: -0.5, y: 0 },
		east: { x: 0.5, z: 0, y: 0 },
		south: { x: 0, z: 0.5, y: 0 },
		west: { x: -0.5, z: 0, y: 0 },
	};

	multiply(vec3, factor) {
		return vec3.multiply({ x: factor, y: factor, z: factor });
	}

	async climbLadder(desiredY) {
		const defaultMove = new Movements(this.bot);
		const ladder = this.bot.findBlock({
			matching: this.bot.registry.blocksByName.ladder.id,
		});

		// this.log(ladder);

		function onMoveClimb() {
			console.log(this.bot.canSeeBlock(ladder));
			if (this.bot.canSeeBlock(ladder)) {
				this.bot.setControlState("left", true);
			} else {
				this.bot.setControlState("left", false);
			}

			lookAtBlock(ladder.position.minus(faces[ladder._properties.facing]));

			if (this.bot.entity.position.y >= desiredY) {
				this.bot.setControlState("forward", false);
				this.bot.removeListener("move", onMoveClimb);
			}
		}
		// this.bot.on("move", onMoveClimb);

		// this.bot.setControlState("forward", true);

		this.bot.pathfinder.setMovements(defaultMove);
		const p = ladder.position
			.plus(this.faces[ladder._properties.facing])
			.plus(this.faces[ladder._properties.facing]);
		this.bot.pathfinder.goto(new GoalBlock(p.x, p.y, p.z)).then(async () => {
			console.log("want to ladder");
			// this.bot.setControlState("sprint", true);
			await this.lookAtBlock(
				ladder.position.minus(this.faces[ladder._properties.facing])
			);
			this.bot.setControlState("forward", true);
		});
	}
	blockCenter(block) {
		return block.position.offset(0.5, 0.5, 0.5);
	}

	async lookAtBlock(blockpos) {
		await this.bot.lookAt(blockpos.offset(0.5, 0.5, 0.5));
	}
	async growTree() {
		this.bot.equip(this.bonemeal, "hand");
		await this.lookAtBlock(this.saplingBlock.position);
		while (
			this.bot.blockAt(this.saplingBlock.position).name.endsWith("sapling")
		) {
			this.bot.activateBlock(this.saplingBlock);
			await wait(500);
		}
	}
	stop() {}

	async placesaplings() {
		const saplings = this.findSaplings();
		if (saplings) {
			this.bot.equip(saplings, "hand");
			const block = this.findTreePlace();
			console.log(block);

			if (block) {
				this.saplingBlock = this.bot.blockAt(block.position.offset(0, 1, 0));
				for (let a = 0; a < 2; a++) {
					for (let b = 0; b < 2; b++) {
						await wait(200);
						await this.lookAtBlock(block.position.offset(-a, 1, -b));
						await wait(200);
						await this.bot.placeBlock(
							this.bot.blockAt(block.position.offset(-a, 0, -b)),
							{
								x: 0,
								y: 1,
								z: 0,
							}
						);
					}
				}
			}
		} else {
			this.info("no more saplings :(");
		}
	}

	static acceptedBlocks = ["podzol", "grass_block", "dirt"];

	findSaplings() {
		return this.bot.inventory.items().find((i) => i.name.endsWith("sapling"));
	}

	isBlockAccepted(block) {
		const pos = block.position;

		if (!this.saplingPlaceble(this.bot.blockAt(pos.offset(-1, 0, 0))))
			return false;
		if (!this.saplingPlaceble(this.bot.blockAt(pos.offset(0, 0, -1))))
			return false;
		if (!this.saplingPlaceble(this.bot.blockAt(pos.offset(-1, 0, -1))))
			return false;
		return true;
	}

	saplingPlaceble(block) {
		if (block.position) {
			const bAbove = this.blockAbove(block).name;
			if (bAbove !== "air" && bAbove !== "grass") {
				return false;
			}
		}
		return TreeChopper.acceptedBlocks.includes(block.name);
	}

	findTreePlace() {
		return this.bot.findBlock({
			matching: this.saplingPlaceble,
			useExtraInfo: this.isBlockAccepted,
			maxDistance: 5,
		});
	}
}

module.exports = {
	asign,
	start,
	stop,
};
