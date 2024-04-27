import { BotInstance } from "./bot";

const http = require("http").createServer();

const io = require("socket.io")(http, {
	cors: { origin: "*" },
});

http.listen(6801, () => console.log("started on port 6801"));

io.on("message", (message) => {
	console.log(message);
});

const testBot = new BotInstance("../frontend/src/lib/bot-settings.json");

testBot.joinLocalhost(45486);

testBot.start();

io.on("connection", (socket) => {
	console.log("a user connected");

	testBot.clientConnect(socket);

	socket.conn.on("close", (reason) => {
		socket.removeAllListeners();
		testBot.clientDisconnect(socket);
		console.log("a user disconnected");
	});

	socket.onAny((event, ...args) => {
		testBot.client.emit(event, ...args);
	});

	testBot.io.onAny((event, ...args) => {
		console.log("emitting", event);
		socket.emit(event, ...args);
	});
});
