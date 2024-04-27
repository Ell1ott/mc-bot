import { Module } from "./module";
const { setTimeout: wait } = require("timers/promises");
class AntiAfk extends Module {
    sneakLoop: NodeJS.Timeout | null;

    start() {
        this.sneakLoop = setInterval(() => {
            this.bot.setControlState("sneak", true);
            
            const [minSneakTime, maxSneakTime] = this.settings.sneaking.sneakinglength.val
            await wait(Math.random() * (minSneakTime - maxSneakTime + 1))

            this.bot.setControlState("sneak", false);

            const [minDelay, maxDelay ] = this.settings.sneaking.timebetweensneaks.val
            await wait(Math.random() * (minDelay - maxDelay + 1))
        }, 0);
    }
    stop() {
        if(this.sneakLoop)
        clearInterval(this.sneakLoop);
    }