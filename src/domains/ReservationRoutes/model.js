const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  otp: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    min: 4,
    max: 26,
  },
  lastName: {
    type: String,
    required: true,
    min: 4,
    max: 26,
  },
  clientEmail: {
    type: String,
    required: true,
    min: 6,
    max: 256,
  },
  personNumber: {
    type: Number,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  numberOfRooms: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
  },

  token: {
    type: String,
  },
});

const Reservation = mongoose.model("reservation", ReservationSchema);
module.exports = Reservation;
