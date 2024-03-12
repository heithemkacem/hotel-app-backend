const RoomService = require("./model");

const CreateService = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { RoomNumber, RoomServiceComments } = req.body;
  const newRoomService = new RoomService({
    RoomNumber,
    RoomServiceComments,
    verified: false,
  });
  await newRoomService.save();

  if (res) {
    res.status(201).json({
      status: "Success",
      message: "Room Service Created",
    });
  } else {
    throw Error("Response object is undefined");
  }
};

module.exports = {
  CreateService,
};
