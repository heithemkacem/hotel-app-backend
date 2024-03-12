// //mongoDB
require("./config/db");
const errorHandler = require("./config/error-handler");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // Correct import
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use(errorHandler);
//cors
app.use(cors());
//for accepting posts from data
app.use(bodyParser.json()); // Correct usage
// Registering routes

//socket io
const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("createRoom", (name) => {
    socket.join(name);
    chatRooms.unshift({ id: generateID(), name, messages: [] });
    socket.emit("roomsList", chatRooms);
    console.log("🚀: chatRooms", chatRooms);
  });

  socket.on("findRoom", (id) => {
    let result = chatRooms.filter((room) => room.id == id);
    // console.log(chatRooms);
    socket.emit("foundRoom", result[0].messages);
    // console.log("Messages Form", result[0].messages);
    console.log("🚀: foundRoom", result[0].messages);
  });

  socket.on("newMessage", (data) => {
    const { room_id, message, user, timestamp } = data;
    let result = chatRooms.filter((room) => room.id == room_id);
    const newMessage = {
      id: generateID(),
      text: message,
      user,
      time: `${timestamp.hour}:${timestamp.mins}`,
    };
    console.log("New Message", newMessage);
    socket.to(result[0].name).emit("roomMessage", newMessage);
    result[0].messages.push(newMessage);

    socket.emit("roomsList", chatRooms);
    socket.emit("foundRoom", result[0].messages);
  });
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});
app.use(routes);
app.get("/api", (req, res) => {
  res.json(chatRooms);
});
app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
