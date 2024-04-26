const io = require("socket.io")(http, {
	cors: { origin: "*" },
});

http.listen(6800, () => log("started on port 6800"));

io.on("message", (message) => {
	log(message);
});
