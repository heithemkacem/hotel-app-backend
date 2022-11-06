const Client = require("./model");
const Hotel = require("./../hotel/model");
const Admin = require("./../admin/model");
const hashData = require("./../../util/hashData");
const verifyHashedData = require("./../../util/verifyHashedData");
const {
  sendOTPVerificationEmail,
} = require("./../otp_verification/controller");
const { ROLES } = require("./../../security/role");
const createClient = async (data) => {
  try {
    const { username, firstName, lastName, email, phone, password } = data;

    const existingHotel = await Hotel.findOne({ hotelEmail: email });
    const existingClient = await Client.findOne({ email: email });
    const existingAdmin = await Admin.findOne({ email: email });
    if (
      existingHotel != null ||
      existingClient != null ||
      existingAdmin != null
    ) {
      //A user aleady exist
      throw Error("email aleardy in use");
    } else {
      //User doesn't exist so we can save him as a new user
      //Hashing Password
      const hashedPassword = await hashData(password);
      const newClient = new Client({
        username,
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        verified: false,
        role: ROLES.CLIENT,
      });
      //Save the organization
      const createdClient = await newClient.save();
      return createdClient;
    }
  } catch (error) {
    throw error;
  }
};

const clientForgetPassword = async (email) => {
  try {
    const fetchedHotel = await Hotel.findOne({ hotelEmail: email });
    const fetchedClient = await Client.findOne({ email: email });
    const fetchedAdmin = await Admin.findOne({ email: email });
    if (fetchedClient != null) {
      await sendOTPVerificationEmail(fetchedClient);
      return fetchedClient;
    } else if (fetchedHotel != null) {
      const _id = fetchedHotel._id;
      const email = fetchedHotel.hotelEmail;
      await sendOTPVerificationEmail({ _id, email });
      return fetchedHotel;
    } else if (fetchedAdmin != null) {
      await sendOTPVerificationEmail(fetchedAdmin);
      return fetchedAdmin;
    } else {
      throw Error("common:email_does_not_exist");
    }
  } catch (error) {
    throw error;
  }
};

const ResetPassword = async (newPassword, email) => {
  try {
    const hashedPasswordUser = await hashData(newPassword);
    const fetchedHotel = await Hotel.findOne({ hotelEmail: email });
    const fetchedClient = await Client.findOne({ email: email });
    const fetchedAdmin = await Admin.findOne({ email: email });
    if (fetchedClient != null) {
      const hashedPassword = fetchedClient.password;
      const passwordMatch = await verifyHashedData(newPassword, hashedPassword);
      console.log(passwordMatch);
      if (passwordMatch === false) {
        await Client.updateOne(
          { email: email },
          { password: hashedPasswordUser }
        );
        return { status: "Success", message: "Password changed" };
      } else {
        throw Error("Password already in use");
      }
    } else if (fetchedHotel != null) {
      const hashedPassword = fetchedHotel.password;
      const passwordMatch = await verifyHashedData(newPassword, hashedPassword);
      if (passwordMatch === false) {
        await Hotel.updateOne(
          { hotelEmail: email },
          { password: hashedPasswordUser }
        );
        return { status: "Success", message: "Password changed" };
      } else {
        throw Error("Password already in use");
      }
    } else if (fetchedAdmin != null) {
      const hashedPassword = fetchedAdmin.password;
      const passwordMatch = await verifyHashedData(newPassword, hashedPassword);
      if (passwordMatch === false) {
        await Admin.updateOne(
          { email: email },
          { password: hashedPasswordUser }
        );
        return { status: "Success", message: "Password changed" };
      } else {
        throw Error("Password already in use");
      }
    } else {
      throw Error("common:email_does_not_exist");
    }
  } catch (error) {
    throw error;
  }
};

const ModifyPasswordFromDashboard = async (id, oldPassword, newPassword) => {
  try {
    const newHashedPassword = await hashData(newPassword);
    const fetchedHotel = await Hotel.findOne({ _id: id });
    const fetchedClient = await Client.findOne({ _id: id });
    const fetchedAdmin = await Admin.findOne({ _id: id });
    if (fetchedClient != null) {
      const hashedPassword = fetchedClient.password;
      const ComparedPassword = await verifyHashedData(
        oldPassword,
        hashedPassword
      );
      if (ComparedPassword) {
        Client.updateOne({ password: newHashedPassword }, { _id: id });
        return {
          status: "Success",
          message: "common:Password changed",
        };
      } else {
        throw Error("common:old_password_is_incorrect");
      }
    } else if (fetchedHotel != null) {
      const hashedPassword = fetchedHotel.password;
      const ComparedPassword = await verifyHashedData(
        oldPassword,
        hashedPassword
      );
      if (ComparedPassword) {
        Hotel.updateOne({ password: newHashedPassword }, { _id: id });
        return {
          status: "Success",
          message: "common:Password changed",
        };
      } else {
        throw Error("common:old_password_is_incorrect");
      }
    } else if (fetchedAdmin != null) {
      const hashedPassword = fetchedAdmin.password;
      const ComparedPassword = await verifyHashedData(
        oldPassword,
        hashedPassword
      );
      if (ComparedPassword) {
        Admin.updateOne({ password: newHashedPassword }, { _id: id });
        return {
          status: "Success",
          message: "common:Password changed",
        };
      } else {
        throw Error("common:old_password_is_incorrect");
      }
    } else {
      throw Error("common:email_does_not_exist");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createClient,
  clientForgetPassword,
  ResetPassword,
  ModifyPasswordFromDashboard,
};
