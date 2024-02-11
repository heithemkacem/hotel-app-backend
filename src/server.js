// //mongoDB
require("./config/db");
const errorHandler = require("./config/error-handler");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // Correct import
const routes = require("./routes");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const socketIO = new Server(server);
app.use(express.json());
app.use(errorHandler);
//cors
app.use(cors());
//for accepting posts from data
app.use(bodyParser.json()); // Correct usage
// Registering routes
app.use(routes);

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("createRoom", (roomName) => {
    socket.join(roomName);
    //👇🏻 Adds the new group name to the chat rooms array
    chatRooms.unshift({ id: generateID(), roomName, messages: [] });
    //👇🏻 Returns the updated chat rooms via another event
    socket.emit("roomsList", chatRooms);
  });
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});
app.get("/chat", (req, res) => {
  res.json(chatRooms);
});
app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
