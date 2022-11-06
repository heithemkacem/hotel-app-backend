const bcrypt = require("bcrypt");

const verifyHashedData = async (data, hashedData) => {
  try {
    comparedData = await bcrypt.compare(data, hashedData);
    return comparedData;
  } catch (error) {
    throw error;
  }
};

module.exports = verifyHashedData;
