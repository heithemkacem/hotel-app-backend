//Express Router
const express = require("express");
const router = express.Router();
const PrivateRoute = require("./../../security/strategy");
const checkRole = require("./../../security/role");
const Client = require("../ClientRoutes/model");
const Message = require("./model");
const multer = require("multer");
const Hotel = require("../HotelRoutes/model");
const fs = require("fs");
router.get(
  "/all",
  PrivateRoute,
  checkRole("admin", ["ADMIN"]),
  async (req, res) => {
    try {
      const messages = await Message.find();
      res.json({
        status: "Success",
        message: "Messages retrieved successfully",
        messages: messages,
      });
    } catch (error) {
      res.json({
        status: "Failed",
        message: error.message,
      });
    }
  }
);

//Get messages by user
router.post(
  "/user",
  PrivateRoute,
  checkRole("admin", ["ADMIN"]),
  async (req, res) => {
    const { userId } = req.body;
    try {
      const messages = await Message.find({ recepientId: userId });
      res.json({
        status: "Success",
        message: "Messages retrieved successfully",
        messages: messages,
      });
    } catch (error) {
      res.json({
        status: "Failed",
        message: error.message,
      });
    }
  }
);

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
//endpoint to post Messages and store it in the backend
router.post(
  "/create-new-message",
  upload.single("imageFile"),
  PrivateRoute,
  async (req, res) => {
    try {
      const { senderId, recepientId, messageType, messageText } = req.body;
      const imageUrl =
        messageType === "image" ? req.file.path.replace(/\\/g, "/") : null;
      console.log(req.body);
      const newMessage = new Message({
        senderId,
        recepientId,
        messageType,
        message: messageText,
        timestamp: new Date(),
        imageUrl: imageUrl,
      });

      await newMessage.save();
      res
        .status(200)
        .json({ status: "Success", message: "Message sent Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
//endpoint to get all messages between 2 persons
router.post("/get-messages", PrivateRoute, async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;
    console.log(senderId, recepientId);
    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    });
    res.json({ status: "Success", messages: messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to delete the messages!
router.post("/delete-message", PrivateRoute, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ status: "Failed", message: "invalid req body!" });
    }
    await Message.deleteMany({ _id: { $in: messages } });
    res.json({ status: "Success", message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
});
router.post("/get-hotels", PrivateRoute, async (req, res) => {
  try {
    const { hotelId } = req.body;
    const user = await Client.findById(hotelId).populate(
      "hotels",
      "hotelName hotelEmail hotelStars image"
    );
    const userHotels = user.hotels;
    res.json({
      status: "Success",
      message: "User Hotel ",
      message: userHotels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/get-clients",
  PrivateRoute,
  checkRole("hotel", ["HOTEL"]),
  (req, res) => {
    try {
      const { hotelId } = req.body;
      Hotel.findById(hotelId)
        .populate("users")
        .then((clients) => {
          if (!clients) {
            return res
              .status(404)
              .json({ status: "Failed", message: "clients not found" });
          }
          //?transform the clients array to an array of client ids and remove the duplicates if any  and return the array
          const clientsList = [
            ...new Set(clients.users.map((client) => client)),
          ];
          res.json({
            status: "Success",
            message: "clients found",
            clients: clientsList,
          });
        });
    } catch (error) {
      console.log("error", error);
      res
        .status(500)
        .json({ status: "Failed", message: "internal server error" });
    }
  }
);

module.exports = router;
