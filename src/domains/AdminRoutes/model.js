const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
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
  phone: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
    min: 6,
    max: 256,
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
    default: "ADMIN",
  },
  token: {
    type: String,
    default: "",
  },
  expoPushToken: {
    type: String,
  },
});
const Admin = mongoose.model("admin", AdminSchema);
module.exports = Admin;
