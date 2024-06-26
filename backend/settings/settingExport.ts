import { moduleSettings } from "../modules";
import fs from "fs";

const SETTINGSPATH = "/saved-settings/";

function deepMerge(obj1, obj2) {
	for (let key in obj2) {
		if (obj2.hasOwnProperty(key) && obj1.hasOwnProperty(key)) {
			if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
				deepMerge(obj1[key], obj2[key]);
			} else {
				obj1[key] = obj2[key];
			}
		}
	}
}

import path from "path"; // Import the 'path' module
export function exportSettings(name) {
	const filePath = path.join(__dirname, name + ".settings.json");
	let oldSettings = {};
	if (fs.existsSync(filePath)) {
		oldSettings = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	}

	deepMerge(moduleSettings, oldSettings);

	const json = JSON.stringify(moduleSettings, null, 2);
	fs.writeFileSync(filePath, json);

	// check if__dirname/../../frontend/lib exists
	return filePath;

	const frontendPath = path.join(__dirname, "../../frontend/src/lib");
	if (fs.existsSync(frontendPath)) {
		const filePath = path.join(frontendPath, "bot-settings.json");
		fs.writeFileSync(filePath, json);
	}
}

export function exportNewSettings(name, settings) {
	const filePath = path.join(__dirname, name + ".settings.json");
	const json = JSON.stringify(settings, null, 2);
	fs.writeFileSync(filePath, json);
}
