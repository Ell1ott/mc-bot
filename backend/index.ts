import { Socket } from "socket.io";
import { BotInstance } from "./bot";
import { exportSettings } from "./settings/settingExport";

const http = require("http").createServer();

const io = require("socket.io")(http, {
	cors: { origin: "*" },
});

http.listen(6801, () => console.log("started on port 6801"));

io.on("message", (message) => {
	console.log(message);
});

// const testBot = new BotInstance(exportSettings("testBot"));

// try {
// testBot.joinLocalhost(45486, "Bob", null, "offline");
// } catch (e) {
// 	console.log(e);
// }

// testBot.start();

let currentBot: null | BotInstance = null;

const bots: Record<string, BotInstance> = {};

function emitBots(socket: Socket) {
	socket.emit(
		"bots",
		Object.entries(bots).map(([name, bot]) => ({
			id: name,
			name: bot.bot?.username,
			health: bot.bot?.health,
			food: bot.bot?.food,
		}))
	);
}

io.on("connection", (socket: Socket) => {
	console.log("a user connected");

	emitBots(socket);

	// testBot.clientConnect(socket);

	socket.conn.on("close", (reason) => {
		socket.removeAllListeners();
		// testBot.clientDisconnect(socket);
		currentBot?.clientDisconnect(socket);
		console.log("a user disconnected");
	});

	socket.on("createBot", (options) => {
		console.log("creating bot", options);
		const newBot = new BotInstance(exportSettings(options.username));
		bots[options.username] = newBot;

		newBot.join(options, (resp) => socket.emit("msa", resp));

		newBot.start();
	});

	socket.on("getBots", () => {
		emitBots(socket);
	});

	let anyListener = (event, ...args) => {};
	socket.on("selectBot", (name) => {
		selectBot(name);
	});
	function selectBot(name) {
		console.log("socket id", socket.id);
		currentBot?.io.offAny();
		currentBot?.clientDisconnect(socket);
		socket.offAny(anyListener);

		currentBot = bots[name];

		anyListener = (event, ...args) => {
			currentBot.client.emit(event, ...args);
		};
		socket.onAny(anyListener);
		currentBot.io.onAny((event, ...args) => {
			socket.emit(event, ...args);
		});
		currentBot.clientConnect(socket);
	}
});
