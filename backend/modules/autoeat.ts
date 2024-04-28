import { Module } from "./module";

class AutoEat extends Module {
	start() {
		this.bot.autoEat.enable();

		(this.bot as any)?.autoEat
			// Setting to true will use offhand slot
			.eat(true)
			.catch((error) => {
				console.log("could not eat");
			});
	}
	stop() {
		this.bot.autoEat.disable();
	}
}

export { AutoEat, AutoEat as module };
