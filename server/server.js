const path = require("path");
const http = require("http");
const express = require("express");
const publicPath = path.join(__dirname, "/../public");
const socketIO = require("socket.io");
const { Socket } = require("dgram");

const port = 8080;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("New user joined", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("recieve", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("exit", { name: users[socket.id] });
    delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
