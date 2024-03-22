const Hotel = require("./model");
const Client = require("../ClientRoutes/model");
const { sendNotification, getReceipt } = require("../../util/sendNotification");
//get hotel by id
const GetHotelById = async (id) => {
  const hotel = await Hotel.findById(id);

  if (!hotel) {
    throw new Error("Hotel not found, Check the id");
  }
  sendNotification(
    hotel.expoPushToken,
    `Welcome to ${hotel.hotelName}!`,
    "You now have access to your hotel's dashboard!"
  );
  getReceipt(hotel.expoPushToken);
  return hotel;
};
//Admin get all hotels
const getAllHotels = async () => {
  const allHotels = await Hotel.find();
  if (!allHotels.length) {
    return null;
  }

  return allHotels;
};
//Admin delete Hotel by id
const deleteHotel = async (id) => {
  const deletedHotel = await Hotel.findByIdAndDelete(id);
  return deletedHotel;
};
//Admin update Hotel by id
const updateHotel = async (id, data) => {
  //find the hotel by id
  const hotel = await Hotel.findById(id);
  if (!hotel) {
    throw Error("common:Hotel_not_found");
  }
  //update the hotel
  const updatedHotel = await Hotel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedHotel;
};
//get hotel by otp
const getHotelByOTP = async (otp) => {
  const hotel = await Hotel.findOne({ otp: otp });

  // const hotel = await Hotel.findById(otp);
  if (!hotel) {
    throw new Error("Hotel not found, Check the otp");
  }
  return hotel;
};
//getusersbyotp
const GetUsersByOTP = async (otp) => {
  const users = await Client.find({ otp: otp });
  if (!users) {
    throw new Error("No user found. Check the OTP.");
  }
  return users;
};
module.exports = {
  GetUsersByOTP,
  GetHotelById,
  getAllHotels,
  updateHotel,
  deleteHotel,
  getHotelByOTP,
};
