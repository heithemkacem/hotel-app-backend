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
module.exports = { GetHotelById };
