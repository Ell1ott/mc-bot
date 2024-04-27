const http = require("http").createServer();

const io = require("socket.io")(http, {
	cors: { origin: "*" },
});

http.listen(6800, () => console.log("started on port 6800"));

io.on("message", (message) => {
	console.log(message);
});
