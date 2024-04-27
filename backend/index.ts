import { BotInstance } from "./bot";

const http = require("http").createServer();

const io = require("socket.io")(http, {
	cors: { origin: "*" },
});

http.listen(6801, () => console.log("started on port 6801"));

io.on("message", (message) => {
	console.log(message);
});

const testBot = new BotInstance("../svelte/src/lib/bot-settings.json");

testBot.joinLocalhost(45486);

testBot.start();

io.on("connection", (socket) => {
	console.log("a user connected");

	testBot.clientConnect(socket);

	socket.conn.on("close", (reason) => {
		testBot.clientDisconnect(socket);
		console.log("a user disconnected");
	});
});
