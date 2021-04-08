const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const http = require("http");
const socketio = require("socket.io");

const app = require("./app");

const server = http.createServer(app);
const io = socketio(server);
const getMessages = require("./utils/messages");

io.on("connection", (socket) => {
  socket.on("chatMessage", async (msg) => {
    io.emit("message", { message: msg, server: false });
    const responses = await getMessages(msg);
    responses.forEach((response) => {
      io.emit("message", { message: response, server: true });
    });
  });
});

const PORT = 3001 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
