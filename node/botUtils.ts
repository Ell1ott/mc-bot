import mineflayer from "mineflayer";

function lookAtEntity(bot: mineflayer.Bot) {
	let friend = bot.nearestEntity();

	if (friend) {
		bot.lookAt(friend.position.offset(0, friend.height, 0));
	}
}
