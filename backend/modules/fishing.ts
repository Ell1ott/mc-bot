const mineflayer = require("mineflayer");
// let this.bot = mineflayer.createBot();
const { setTimeout: wait } = require("timers/promises");
const { getSetting } = require("../settingHelper");
const { randomBytes } = require("crypto");
import { Module } from "./module";

class Fishing extends Module {
	containers = [] as any[];

	startingRot;

	isRunning;
	start() {
		console.log(this.settings);
		this.startingRot = {
			yaw: this.bot.entity.yaw,
			pitch: this.bot.entity.pitch,
		};
		this.containers = this.findContainers(
			this.settings.storeaway.storageblocks.val
		);
		this.startFishing();
		this.isRunning = true;
		// this.legitLoop();
	}

	stop() {
		this.stopFishing();
		this.isRunning = false;
	}

	async legitLoop() {
		if (this.settings.headrot.val) {
			// await wait(Math.random() * 2000);
			await this.bot.look(
				this.startingRot.yaw + Math.random() * 0.5 - 0.25,
				this.startingRot.pitch + Math.random() * 0.5 - 0.25
			);
			if (this.isRunning) this.legitLoop();
		}
	}

	nowFishing = false;

	// : mineflayer.this.bot
	async startFishing() {
		// this.log("Fishing");
		this.log("fishing");

		try {
			const fishing_rod_in_hotbar = this.bot.inventory
				.items()
				.find((item) => item.name == "fishing_rod" && item.slot > 35);

			if (fishing_rod_in_hotbar) {
				this.bot.setQuickBarSlot(fishing_rod_in_hotbar.slot - 36);
			} else {
				if (this.settings.takefrominventory.val) {
					const fishing_rod = this.bot.inventory
						.items()
						.find((item) => item.name == "fishing_rod");
					if (fishing_rod) {
						await wait(200);
						this.bot.equip(fishing_rod, null);
						this.info("took fishing rod from inventory");
						await wait(200);
					} else {
						this.alert("No fishing rod in inventory");
						return;
					}
				} else {
					this.alert("No fishing rod in hotbar");
					return;
				}
			}
		} catch (err) {
			return this.log(err.message);
		}

		this.nowFishing = true;
		if (this.isInventoryFull(false) && this.settings.storeaway.enabled) {
			const pYaw = this.bot.entity.yaw;
			const pPitch = this.bot.entity.pitch;
			await this.dumpInChest(true);

			await this.bot.look(pYaw, pPitch);
		}
		// this.bot.on("playerCollect", onCollect);
		this.info("Startet fishing");
		try {
			this.swing();
			await this.bot.fish(400, this.settings.swing).then(() => {
				setTimeout(() => {
					this.startFishing();
				}, 1000);
			});
		} catch (err) {
			this.log(err.message);
		}
		this.nowFishing = false;
	}
	findContainers(blocks = []) {
		const chestToOpen = this.bot.findBlocks({
			matching: blocks.map((name) => this.bot.registry.blocksByName[name].id),
			maxDistance: 6,
			count: 10,
		});
		if (!chestToOpen) {
			this.log("no chest found");
			return [];
		}

		this.log(chestToOpen);
		this.log(chestToOpen[0]);

		return chestToOpen;
	}
	async dumpInChest(excludeHotbar, excludeItems: string[] = []) {
		if (this.containers.length == 0) {
			this.alert("no more this.containers with space in them");
			return;
		}

		let chestToOpen = this.bot.blockAt(this.containers[0]);
		await wait(100);
		await this.bot.lookAt(chestToOpen.position);
		await wait(100);
		let chest;

		try {
			chest = await this.bot.openContainer(chestToOpen);
		} catch {
			this.containers.shift();
			await this.dumpInChest(excludeHotbar, excludeItems);
			return;
		}
		let spaceLeft = this.containerSpace(chest) - chest.containerItems().length;
		for (let slot of this.bot.inventory.slots) {
			if (
				slot &&
				!excludeItems.includes(slot.name) &&
				(!excludeHotbar || slot.slot < 36) &&
				slot.slot > 8
			) {
				if (spaceLeft == 0) {
					this.log("container at " + chestToOpen.position + " is full");
					await wait(200);
					chest.close();
					this.containers.shift();
					await this.dumpInChest(excludeHotbar, excludeItems);
					return;
				}
				await chest.deposit(slot.type, null, slot.count);
				console.log(
					getSetting(this.settings.storeaway.storeitemdelay, true, true)
				);
				await wait(
					getSetting(this.settings.storeaway.storeitemdelay, true, true)
				);

				spaceLeft = this.containerSpace(chest) - chest.containerItems().length;
			}
		}

		chest.close();
	}

	containerSpace(container) {
		return (
			container.slots.length -
			(container.inventoryEnd - container.inventoryStart)
		);
	}

	isInventoryFull(excludeHotbar) {
		const items = this.bot.inventory.items();
		if (!excludeHotbar) {
			return items.length == 36;
		}
		let count = 0;
		items.forEach((item) => {
			if (item.slot < 36) count++;
		});
		return count == 27;
	}

	swing() {
		if (this.settings.swing) {
			this.bot.swingArm("right");
		}
	}

	stopFishing() {
		// this.bot.removeListener("playerCollect", onCollect);

		if (this.nowFishing) {
			this.swing();
			this.bot.activateItem();
			this.nowFishing = false;
		}
	}
}

export { Fishing };
