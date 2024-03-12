const bcrypt = require("bcrypt");

const hashData = async (data, saltRounds = process.env.SALT) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    throw error;
  }
};

module.exports = hashData;
