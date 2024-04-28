import { moduleSettings } from "../modules";
import fs from "fs";
import path from "path"; // Import the 'path' module

console.log(JSON.stringify(moduleSettings));

const json = JSON.stringify(moduleSettings, null, 2);
const filePath = path.join(__dirname, "../settings/settings.json");
fs.writeFileSync(filePath, json);

// check if__dirname/../../frontend/lib exists

const frontendPath = path.join(__dirname, "../../frontend/src/lib");
if (fs.existsSync(frontendPath)) {
	console.log("hsjdkd");
	const filePath = path.join(frontendPath, "bot-settings.json");
	fs.writeFileSync(filePath, json);
}
