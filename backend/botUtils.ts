import mineflayer from "mineflayer";

function lookAtEntity(bot: mineflayer.Bot) {
	let friend = bot.nearestEntity();

	if (friend) {
		bot.lookAt(friend.position.offset(0, friend.height, 0));
	}
}

// require("./utils/blockutils.js")(bot);
function canCraft(recipe, crafting_table: boolean) {
	const input = recipe.inShape || recipe.ingredients;
	let needsCraftingTable = input.length > 2 || input[0].length > 2;

	if (!crafting_table && needsCraftingTable) return false;
	let itemsNeeded: Record<string, number> = {};
	input.flat().forEach((id) => {
		if (id == null) return;
		itemsNeeded[id] = itemsNeeded[id] + 1 || 1;
	});

	const ids = Object.keys(itemsNeeded);
	const counts = Object.values(itemsNeeded);
	// log(itemsNeeded);
	// log(ids.map((x) => (!x ? null : bot.registry.items[x].name)));
	// log(counts);
	for (let i = 0; i < ids.length; i++) {
		if (this.bot.inventory.count(ids[i], null) < counts[i]) return false;
	}
	return true;
}

function canCraftItem(id, crafting_table) {
	const recipes = this.bot.registry.recipes[id];

	return canCraftRecipes(recipes, crafting_table);
}
function canCraftRecipes(recipes, crafting_table) {
	for (let i = 0; i < recipes.length; i++) {
		const recipe = recipes[i];

		if (canCraft(recipe, crafting_table)) return true;
	}
	return false;
}

function itemIdsToNames(ids, bot: mineflayer.Bot) {
	return ids.map((x) => (!x ? null : bot.registry.items[x].name));
}

function itemNamefromid(id, bot: mineflayer.Bot) {
	return bot.registry.items[id]?.name;
}

function getAllPosibleRecipes(bot: mineflayer.Bot) {
	const recipeItems = bot.registry.recipes;

	return Object.keys(recipeItems).filter((item) => canCraftItem(item, true));
}

export {
	lookAtEntity,
	canCraft,
	canCraftItem,
	canCraftRecipes,
	itemIdsToNames,
	itemNamefromid,
	getAllPosibleRecipes,
};
