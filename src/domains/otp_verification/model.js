
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "Hotel" },
  otp: { type: String },
  expiresAt: { type: Date },
  createdAt: { type: Date },
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;

// const Schema = mongoose.Schema;
// const OTPSchema = new Schema({
//   userID: { type: String },
//   otp: { type: String },
//   expiresAt: { type: Date },
//   createdAt: { type: Date },
// });
// const OTP = mongoose.model("otp", OTPSchema);
// module.exports = OTP;
