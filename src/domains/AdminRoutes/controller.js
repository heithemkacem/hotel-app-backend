const Admin = require("./model");
const Hotel = require("./../HotelRoutes/model");
const Client = require("./../ClientRoutes/model");

const hashData = require("./../../util/hashData");
const verifyHashedData = require("./../../util/verifyHashedData");
const { ROLES } = require("./../../security/roles");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const {
  sendOTPVerificationEmail,
  sendOTPHotelEmail,
} = require("./../OTPVerificationRoutes/controller");
const { sendNotification, getReceipt } = require("../../util/sendNotification");
const createAdmin = async (data) => {
  const { username, firstName, lastName, email, password, phone } = data;
  const existingClient = await Client.findOne({ email: email });
  const existingHotel = await Hotel.findOne({ hotelEmail: email });
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
};
const authenticate = async (email, password, expoPushToken) => {
  const fetchedHotel = await Hotel.findOne({ hotelEmail: email });
  const fetchedClient = await Client.findOne({ email: email });
  const fetchedAdmin = await Admin.findOne({ email: email });

  if (fetchedClient != null) {
    if (expoPushToken === undefined) {
      return authenticateClient(fetchedClient, password);
    }
    sendNotification(
      expoPushToken,
      "Login Notification",
      "You have been logged in"
    );
    getReceipt(expoPushToken);
    return authenticateClient(fetchedClient, password);
  }
  if (fetchedHotel != null) {
    return authenticateHotel(fetchedHotel, password);
  }
  if (fetchedAdmin != null) {
    return authenticateAdmin(fetchedAdmin, password);
  }
  throw Error("common:Invalid_credentials");
};

const authenticateClient = async (fetchedClient, password) => {
  const { verified, _id, email, firstName, lastName } = fetchedClient;

  if (!verified) {
    await sendOTPVerificationEmail(fetchedClient);
    return {
      status: "Verify",
      message: "common:Verify_your_account",
      id: _id,
    };
  }

  const passwordMatch = await verifyHashedData(
    password,
    fetchedClient.password
  );

  if (!passwordMatch) {
    throw Error("common:Invalid_credentials");
  }

  const token = jwt.sign(
    {
      id: _id,
      email,
      role: "CLIENT",
      firstName,
      lastName,
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
    token: "Bearer " + fetchedClient.token,
    user: fetchedClient,
  };
};

const authenticateHotel = async (fetchedHotel, password) => {
  const { verified, _id, hotelEmail, hotelName, otp } = fetchedHotel;
  if (!verified) {
    await sendOTPVerificationEmail({ _id, email: hotelEmail });
    return {
      status: "Verify",
      message: "common:Verify_your_account",
      id: _id,
    };
  }
  const passwordMatch = await verifyHashedData(password, fetchedHotel.password);

  if (!passwordMatch) {
    throw Error("common:Invalid_credentials");
  }

  const token = jwt.sign(
    {
      id: _id,
      email: hotelEmail,
      role: "HOTEL",
      hotelName,
      otp,
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
    token: "Bearer " + fetchedHotel.token,
    user: fetchedHotel,
  };
};
const authenticateAdmin = async (fetchedAdmin, password) => {
  const { verified, _id, email } = fetchedAdmin;

  if (!verified) {
    await sendOTPVerificationEmail(fetchedAdmin);
    return {
      status: "Verify",
      message: "common:Verify_your_account",
      id: _id,
    };
  }

  const passwordMatch = await verifyHashedData(password, fetchedAdmin.password);

  if (!passwordMatch) {
    throw Error("common:Invalid_credentials");
  }

  const token = jwt.sign(
    {
      id: _id,
      email,
      role: "ADMIN",
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
    token: "Bearer " + fetchedAdmin.token,
    user: fetchedAdmin,
  };
};
//Admin Create Hotel
const createHotel = async (hotelCredentails) => {
  const {
    hotelName,
    hotelAddress,
    hotelCity,
    hotelStars,
    hotelRooms,
    hotelPrice,
    hotelDescription,
    hotelPhone,
    hotelEmail,
    password,
    contentType,
    name,
    data,
  } = hotelCredentails;
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
      hotelPhone,
      hotelEmail,
      password: hashedPassword,
      verified: true,
      role: ROLES.HOTEL,
      name: name,
      data: data,
      contentType: contentType,
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
