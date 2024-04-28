import type { Module } from "./modules/module";

var glob = require("glob"),
	path = require("path");

let modules: Record<string, typeof Module> = {};

glob.sync("./modules/*.ts").forEach(function (file) {
	console.log(file);
	const module = require(path.resolve(file.replace(".ts", "")))
		.module as typeof Module;
	if (!module) return;
	modules[path.basename(file, path.extname(file))] = module;
});

export { modules };

console.log(Object.keys(modules));
export const moduleSettings = Object.fromEntries(
	Object.entries(modules).map(([k, v]) => [k, v.deafultSettings])
);
