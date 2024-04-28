const fs = require("fs");

const settingsFilePath = "../frontend/src/lib/bot-settings.json";

function loadSettings(path) {
	let rawdata = fs.readFileSync(path);
	let dict = JSON.parse(rawdata);

	return dict;
}
let debounceTimeout;
function updateSetting(settings, settingPath, newVal) {
	list = settingPath.split(".");
	switch (list[list.length - 1]) {
		case "0":
		case "1":
			list.splice(list.length - 1, 0, "val");
			break;
		case "enabled":
			break;
		default:
			list.push("val");
	}

	console.log("updated setting: " + settingPath + " to " + newVal);
	console.log(list);
	// if (list[list.length - 1] === "min")

	const result = list.reduce((acc, cur, index) => {
		if (index === list.length - 1) {
			try {
				acc[cur] = newVal; // modify the value of the final nested property
			} catch {
				console.log(acc + " does not exist. maybe a typo?");
			}
		}
		return acc[cur];
	}, settings);
	// clearTimeout(debounceTimeout);
	// debounceTimeout = setTimeout(() => {
	//   // Save settings to a JSON file here
	//   saveSettings();
	// }, 500);
}

// console.log(getSetting(settings.antiafk.sneaking.timebetweensneaks));
function saveSettings() {
	if (!settings) {
		console.log("settings are not intialized, so skipping save");
		return;
	}
	const jsonData = JSON.stringify(settings);

	fs.writeFile(settingsFilePath, jsonData, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Settings saved!");
		}
	});
}
module.exports = {
	loadSettings: loadSettings,
	updateSetting: updateSetting,
	saveSettings: saveSettings,
};

// export default getSetting;
