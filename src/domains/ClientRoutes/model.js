const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ClientSchema = new Schema({
  username: {
    type: String,
    require: true,
    min: 4,
    max: 26,
  },
  firstName: {
    type: String,
    require: true,
    min: 4,
    max: 26,
  },
  lastName: {
    type: String,
    require: true,
    min: 4,
    max: 26,
  },
  email: {
    type: String,
    require: true,
    min: 6,
    max: 256,
  },
  phone: {
    type: Number,
    require: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
  },
  role: {
    type: String,
    default: "CLIENT",
  },
  token: {
    type: String,
  },
});
const Client = mongoose.model("client", ClientSchema);
module.exports = Client;
