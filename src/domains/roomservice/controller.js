const RoomService = require("./model");

const makeService = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const {
      RoomNumber,
      RoomServiceComments,
   
    } = req.body;

    const newRoomService = new RoomService ({
        RoomNumber,
        RoomServiceComments,
      verified: false,
    });

    await newRoomService.save();

    // Check if 'res' is defined before accessing 'status'
    if (res) {
      res.status(201).json({
        status: 'Success',
        message: 'RoomService submitted successfully',
        RoomService: newRoomService,
      });
    } else {
      console.error('Error in makeService: Response object is undefined');
    }
  } catch (error) {
    console.error('Error in makeService:', error);

    // Check if 'res' is defined before accessing 'status'
    if (res) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.error('Error in makeService: Response object is undefined');
    }
  }
};

module.exports = {
    makeService,
};
