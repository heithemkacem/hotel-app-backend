const Reservation = require("./model");

const makeReservation = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const {
      otp,
      clientEmail,
      firstName,
      lastName,
      personNumber,
      checkInDate,
      checkOutDate,
      numberOfRooms,
    } = req.body;

    const newReservation = new Reservation({
      otp,
      clientEmail,
      firstName,
      lastName,
      personNumber,
      checkInDate,
      checkOutDate,
      numberOfRooms,
      verified: false,
    });

    await newReservation.save();

    // Check if 'res' is defined before accessing 'status'
    if (res) {
      res.status(201).json({
        status: 'Success',
        message: 'Reservation created successfully',
        reservation: newReservation,
      });
    } else {
      console.error('Error in makeReservation: Response object is undefined');
    }
  } catch (error) {
    console.error('Error in makeReservation:', error);

    // Check if 'res' is defined before accessing 'status'
    if (res) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.error('Error in makeReservation: Response object is undefined');
    }
  }
};

module.exports = {
  makeReservation,
};
