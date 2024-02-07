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
app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
