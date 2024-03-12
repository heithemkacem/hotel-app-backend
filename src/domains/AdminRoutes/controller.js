const Admin = require("./model");
const Hotel = require("./../HotelRoutes/model");
const Client = require("./../ClientRoutes/model");
const OTP = require("./../OTPVerificationRoutes/model");

const hashData = require("./../../util/hashData");
const verifyHashedData = require("./../../util/verifyHashedData");
const { ROLES } = require("./../../security/role");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const {
  sendOTPVerificationEmail,
  sendOTPHotelEmail,
} = require("./../OTPVerificationRoutes/controller");

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
      throw Error("common:Email_already_in_use");
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
        throw Error("common:Invalid_credentials");
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
            firstName: fetchedClient.firstName,
            lastName: fetchedClient.lastName,
          },
          process.env.SECRET,
          {
            expiresIn: "7d",
          }
        );
        fetchedClient.token = token;
        return {
          status: "Success",
          message: "Client Found",
          whoami: "Client",
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
        throw Error("common:Invalid_credentials");
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
            hotelName: fetchedHotel.hotelName,
            otp: fetchedHotel.otp,
          },
          process.env.SECRET,
          {
            expiresIn: "7d",
          }
        );
        fetchedHotel.token = token;
        return {
          status: "Success",
          message: "Hotel Found",
          whoami: "Hotel",
          token: "Bearer " + fetchedHotel.token,
          user: fetchedHotel,
        };
      }
    } else if (fetchedAdmin != null) {
      const hashedPassword = fetchedAdmin.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (passwordMatch === false) {
        throw Error("common:Invalid_credentials");
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
            expiresIn: "7d",
          }
        );
        fetchedAdmin.token = token;
        return {
          status: "Success",
          message: "Admin Found",
          whoami: "Admin",
          token: "Bearer " + fetchedAdmin.token,
          user: fetchedAdmin,
        };
      }
    } else {
      throw Error("common:Invalid_credentials");
    }
  } catch (error) {
    throw error;
  }
};

//Admin Create Hotel
const createHotel = async (data) => {
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

  if (existingHotel || existingClient || existingAdmin) {
    // A user already exists
    throw Error("common:Email_already_in_use");
  } else {
    // Hotel doesn't exist so we can save it as a new user
    const hashedPassword = await hashData(password);
    // Generate OTP code
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
    // Create Hotel
    const newHotel = new Hotel({
      otp: otp,
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
      verified: true,
      role: ROLES.HOTEL,
    });
    // Save the hotel
    const createdHotel = await newHotel.save();
    await sendOTPHotelEmail({ otp: otp, email: createdHotel.hotelEmail });
  }
};
const getAllUsers = async () => {
  const users = await Client.find();
  if (!users.length) {
    return null;
  }
  return users;
};

module.exports = {
  authenticate,
  createAdmin,
  createHotel,
  getAllUsers,
};
