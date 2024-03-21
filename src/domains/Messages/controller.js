const Hotel = require("./model");

const Client = require("../ClientRoutes/model");

//Create a message that get the clinet or hotel recipent id and the sender id and the message type and the message and the image url
async function createMessage({
  senderId,
  recepientId,
  messageType,
  message,
  imageUrl,
}) {
  const newMessage = new Message({
    senderId,
    recepientId,
    messageType,
    message,
    imageUrl,
  });
  return await newMessage.save();
}

module.exports = {};
