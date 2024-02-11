const Hotel = require("./model");
const Reservation = require("./../reservation/model");
const verifyHashedData = require("./../../util/verifyHashedData");
const { ROLES } = require("./../../security/role");
const OTPVerification = require("./model");
//get hotel by id
const GetHotelById = async (id) => {
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      throw new Error("Hotel not found, Check the id");
    }
    return hotel;
  } catch (error) {
    throw error;
  }
};
//Admin get all hotels
const getAllHotels = async () => {
  try {
    const allHotels = await Hotel.find();
    if (!allHotels.length) {
      return null;
    }

    return allHotels;
  } catch (error) {
    throw error;
  }
};
//Admin delete Hotel by id
const deleteHotel = async (id) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(id);
    return deletedHotel;
  } catch (error) {
    throw error;
  }
};
//Admin update Hotel by id
const updateHotel = async (id, data) => {
  try {
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
  } catch (error) {
    throw error;
  }
};
//get hotel by otp
const getHotelByOTP = async (otp) => {
  try {
    const hotel = await OTPVerification.findOne({ otp: otp });

    // const hotel = await Hotel.findById(otp);
    if (!hotel) {
      throw new Error("Hotel not found, Check the otp");
    }
    return hotel;
  } catch (error) {
    throw error;
  }
};
//getusersbyotp
const GetUsersByOTP = async (otp) => {
  console.log("hee");

  try {
    const user = await Reservation.findOne({ otp: otp });
    if (!user) {
      throw new Error("user not found, Check the otp");
    }
    return user;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  GetUsersByOTP,
  GetHotelById,
  getAllHotels,
  updateHotel,
  deleteHotel,
  getHotelByOTP,
};
