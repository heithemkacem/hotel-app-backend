const Hotel = require("./model");
const verifyHashedData = require("./../../util/verifyHashedData");
const { ROLES } = require("./../../security/role");

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

module.exports = { GetHotelById, getAllHotels, updateHotel, deleteHotel };
