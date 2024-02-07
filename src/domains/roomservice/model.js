const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomServiceSchema = new Schema({
  
  RoomNumber: {
    type: Number,
    require: true,
  },
  RoomServiceComments: {
    type: String,
    required: true,
    min: 4,
    max: 800,
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
    default: "RoomService",
  },
  token: {
    type: String,
  },
});

const RoomService = mongoose.model("RoomService", RoomServiceSchema);
module.exports = RoomService;
