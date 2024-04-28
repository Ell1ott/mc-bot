import type { Vec3 } from "vec3";
import type { BotInstance } from "../bot";
import { Module } from "./module";

const mineflayer = require("mineflayer");
// let bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settings/settingHelper");

const moduleSettings = {
	...Module.deafultSettings,
	mode: {
		val: "strip_mining",
		t: "mode",
		modes: {
			straight: {
				lookstraight: {
					val: false,
					t: "bool",
					d: "look straight",
				},
				cancelWhenBlockInFront: {
					val: true,
					t: "bool",
					d: "cancel when block in change",
				},
				blocktobreak: {
					val: "obsidian",
					options: ["obsidian", "stone"],
					t: "option",
					d: "block to break",
				},
			},
			strip_mining: {
				blocktobreak: {
					val: "obsidian",
					options: ["obsidian", "stone"],
					t: "option",
					d: "block to break",
				},
			},
		},
	},
};

class AutoMine extends Module<typeof AutoMine.deafultSettings> {
	static deafultSettings = moduleSettings;

	isDigging = false;
	pPitch = Math.PI / 2;
	constructor(botInstance: BotInstance, settingName: string) {
		super(botInstance, settingName);
	}

	async start() {
		switch (this.settings.mode.val) {
			case "straight":
				this.pPitch = this.bot.entity.pitch;
				if (this.settings.mode.modes.straight.lookstraight.val)
					await this.bot.look(this.bot.entity.yaw, 0);
				this.isDigging = true;
				this.dig();
				break;
			case "strip_mining":
				this.startStripMining();
				break;
		}
	}
	block;
	async dig() {
		if (!this.isDigging) return;

		this.block = this.bot.blockAtCursor(5);

		if (!this.block) {
			await wait(100);
		} else {
			try {
				await this.bot.dig(this.block, "ignore", "raycast"); // 2nd param: true to 'snap at block' or 'ignore' to just not turn head
			} catch {}
		}
		await this.dig();
	}

	async stop() {
		this.isDigging = false;
		this.bot.stopDigging();
		if (!this.settings.mode.modes.straight.lookstraight.val) return;
		await this.bot.look(this.bot.entity.yaw, this.pPitch);
	}

	async lookAtBlock(block) {
		await this.bot.lookAt(block.position.plus({ x: 0.5, y: 0.5, z: 0.5 }));
	}

	sides = [
		{ x: 1, y: 0, z: 0 },
		{ x: -1, y: 0, z: 0 },
		{ x: 0, y: 1, z: 0 },
		{ x: 1, y: -1, z: 0 },
		{ x: 0, y: 0, z: 1 },
		{ x: 0, y: 0, z: -1 },
	];

	async collectVein(block) {
		for (const side of this.sides) {
			const b = this.bot.blockAt(block.position.plus(side));
			if (this.veinBlocks.includes(b.name)) {
				// await mineBlock(bot.blockAt(block.position.plus(side)));
				await this.bot.collectBlock.collect(b);
				await this.collectVein(b);
			}
		}
	}
	veinBlocks = ["iron_ore", "gold_ore"];
	async mineBlock(block) {
		await this.lookAtBlock(block);
		await this.bot.dig(block, "ignore", "raycast");
		await this.collectVein(block);
	}
	async startStripMining() {
		console.log("started strip mining");
		const dir = { x: 3, y: 1, z: 0 } as Vec3;
		while (true) {
			const grass = this.bot.findBlock({
				matching: this.bot.registry.blocksByName.oak_log.id,
				maxDistance: 64,
			});
			if (grass) {
				// If we found one, collect it.
				try {
					await this.bot.collectBlock.collect(grass);
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
		await this.bot.lookAt(this.bot.entity.position.plus(dir));
		console.log("looked");

		let f = false;

		while (true) {
			for (let i = 0; i < 4; i++) {
				this.block = this.bot.blockAt(
					this.bot.entity.position.plus({ x: i, y: 1, z: 0 } as Vec3)
				);
				// console.log(block.name);
				if (this.block.type !== 0) {
					this.bot.setControlState("forward", false);

					await this.mineBlock(this.block);
				}
				this.block = this.bot.blockAt(
					this.bot.entity.position.plus({ x: i, y: 0, z: 0 } as Vec3)
				);
				if (this.block.type !== 0) {
					this.bot.setControlState("forward", false);
					await this.mineBlock(this.block);
				}
			}

			this.bot.setControlState("forward", true);
			await wait(100);
		}

		while (false) {
			this.block = this.bot.blockAtCursor(5);
			if (this.block) {
				console.log("found block");
				if (
					this.block.position.y === this.bot.entity.position.y ||
					this.block.position.y === this.bot.entity.position.y + 1
				) {
					this.bot.setControlState("forward", false);
					f = false;
					await this.bot.dig(this.block, "ignore", "raycast");
					await wait(200);

					continue;
				}
			}
			if (!f) {
				this.bot.setControlState("forward", true);
				f = true;
			}
			await wait(100);
		}

		// await bot.look(0, 0);
	}
}

export { AutoMine, AutoMine as module };
