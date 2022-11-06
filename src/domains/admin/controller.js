const Admin = require("./model");
const Hotel = require("./../hotel/model");
const Client = require("./../client/model");
const hashData = require("./../../util/hashData");
const verifyHashedData = require("./../../util/verifyHashedData");
const { ROLES } = require("./../../security/role");
const jwt = require("jsonwebtoken");
const {
  sendOTPVerificationEmail,
} = require("./../otp_verification/controller");
const createAdmin = async (data) => {
  try {
    const { username, firstName, lastName, email, password, phone } = data;
    const existingHotel = await Hotel.findOne({ hotelEmail: email });
    const existingClient = await Client.findOne({ email: email });
    const existingAdmin = await Admin.findOne({ email: email });
    if (
      existingHotel != null ||
      existingClient != null ||
      existingAdmin != null
    ) {
      //A user aleady exist
      throw Error("Email aleardy in use");
    } else {
      //User doesn't exist so we can save him as a new user
      //Hashing Password
      const hashedPassword = await hashData(password);
      const newAdmin = new Admin({
        username,
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        verified: false,
        role: ROLES.ADMIN,
      });
      //Save the organization
      const createdAdmin = await newAdmin.save();
      return createdAdmin;
    }
  } catch (error) {
    throw error;
  }
};
const authenticate = async (email, password) => {
  try {
    const fetchedHotel = await Hotel.findOne({ hotelEmail: email });
    const fetchedClient = await Client.findOne({ email: email });
    const fetchedAdmin = await Admin.findOne({ email: email });

    if (fetchedClient != null) {
      const hashedPasswordClient = fetchedClient.password;
      const passwordMatchClient = await verifyHashedData(
        password,
        hashedPasswordClient
      );
      if (passwordMatchClient === false) {
        throw Error("Incorrect credentials match");
      } else {
        if (!fetchedClient.verified) {
          await sendOTPVerificationEmail(fetchedClient);
          return {
            status: "Verify",
            message: "common:Verify_your_account",
            id: fetchedClient._id,
          };
        }
        //password match
        const token = jwt.sign(
          {
            id: fetchedClient._id,
            email: fetchedClient.email,
            role: ROLES.CLIENT,
          },
          process.env.SECRET,
          {
            expiresIn: "48h",
          }
        );
        fetchedClient.token = token;
        return {
          status: "Success",
          message: "Admin Found",
          token: "Bearer " + fetchedClient.token,
          user: fetchedClient,
        };
      }
    } else if (fetchedHotel != null) {
      const hashedPasswordHotel = fetchedHotel.password;
      const passwordMatchHotel = await verifyHashedData(
        password,
        hashedPasswordHotel
      );
      if (passwordMatchHotel === false) {
        throw Error("Incorrect credentials match");
      } else {
        if (!fetchedHotel.verified) {
          const _id = fetchedHotel._id;
          const email = fetchedHotel.hotelEmail;
          await sendOTPVerificationEmail({ _id, email });
          return {
            status: "Verify",
            message: "common:Verify_your_account",
            id: fetchedHotel._id,
          };
        }
        //password match
        const token = jwt.sign(
          {
            id: fetchedHotel._id,
            email: fetchedHotel.email,
            role: ROLES.HOTEL,
          },
          process.env.SECRET,
          {
            expiresIn: "48h",
          }
        );
        fetchedHotel.token = token;
        return {
          status: "Success",
          message: "Admin Found",
          token: "Bearer " + fetchedHotel.token,
          user: fetchedHotel,
        };
      }
    } else if (fetchedAdmin != null) {
      const hashedPassword = fetchedAdmin.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (passwordMatch === false) {
        throw Error("Incorrect credentials match");
      } else {
        if (!fetchedAdmin.verified) {
          await sendOTPVerificationEmail(fetchedAdmin);
          return {
            status: "Verify",
            message: "common:Verify_your_account",
            id: fetchedAdmin._id,
          };
        }
        const token = jwt.sign(
          {
            id: fetchedAdmin._id,
            email: fetchedAdmin.email,
            role: ROLES.ADMIN,
          },
          process.env.SECRET,
          {
            expiresIn: "48h",
          }
        );
        fetchedAdmin.token = token;
        return {
          status: "Success",
          message: "Admin Found",
          token: "Bearer " + fetchedAdmin.token,
          user: fetchedAdmin,
        };
      }
    } else {
      throw Error("Incorrect credentials match");
    }
  } catch (error) {
    throw error;
  }
};

//Admin Create Hotel
const createHotel = async (data) => {
  try {
    const {
      hotelName,
      hotelAddress,
      hotelCity,
      hotelStars,
      hotelRooms,
      hotelPrice,
      hotelDescription,
      hotelImage,
      hotelPhone,
      hotelEmail,
      password,
    } = data;
    const existingHotel = await Hotel.findOne({ hotelEmail: hotelEmail });
    const existingClient = await Client.findOne({ email: hotelEmail });
    const existingAdmin = await Admin.findOne({ email: hotelEmail });

    if (
      existingHotel != null ||
      existingClient != null ||
      existingAdmin != null
    ) {
      //A user aleady exist
      throw Error("Email aleardy in use");
    } else {
      //Hotel doesn't exist so we can save him as a new user
      //Hashing Password
      const hashedPassword = await hashData(password);
      const newHotel = new Hotel({
        hotelName,
        hotelAddress,
        hotelCity,
        hotelStars,
        hotelRooms,
        hotelPrice,
        hotelDescription,
        hotelImage,
        hotelPhone,
        hotelEmail,
        password: hashedPassword,
        verified: false,
        role: ROLES.HOTEL,
      });
      //Save the organization
      const createdHotel = await newHotel.save();
      return createdHotel;
    }
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
      throw Error("Hotel not found");
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

//Admin get all hotels
const getAllHotels = async () => {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authenticate,
  createAdmin,
  createHotel,
  getAllHotels,
  updateHotel,
  deleteHotel,
};
