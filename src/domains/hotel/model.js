const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HotelSchema = new Schema({
  hotelName: {
    type: String,
    require: true,
    min: 4,
    max: 26,
  },
  hotelAddress: {
    type: String,
    require: true,
    min: 4,
    max: 26,
  },
  hotelCity: {
    type: String,
    require: true,
    min: 4,
    max: 26,
  },
  hotelStars: {
    type: Number,
    require: true,
  },
  hotelRooms: {
    type: Number,
    require: true,
  },
  hotelPrice: {
    type: Number,
    require: true,
  },
  hotelDescription: {
    type: String,
    require: true,
  },
  hotelImage: {
    type: String,
    require: true,
  },
  hotelPhone: {
    type: Number,
    require: true,
  },
  hotelEmail: {
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
    default: "HOTEL",
  },
  token: {
    type: String,
  },
});
const Hotel = mongoose.model("hotel", HotelSchema);
module.exports = Hotel;
