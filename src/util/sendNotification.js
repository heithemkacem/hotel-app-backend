const { Expo } = require("expo-server-sdk");

const sendNotification = async (expoPushToken, title, message) => {
  const expo = new Expo({ accessToken: process.env.ACCESS_TOKEN });

  const chunks = expo.chunkPushNotifications([
    { to: expoPushToken, sound: "default", title: title, body: message },
  ]);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  let response = "";

  for (const ticket of tickets) {
    if (ticket.status === "error") {
      if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
        response = "DeviceNotRegistered";
      }
    }

    if (ticket.status === "ok") {
      response = ticket.id;
    }
  }

  return response;
};
const getReceipt = async (receiptId) => {
  const expo = new Expo({ accessToken: process.env.ACCESS_TOKEN });

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds([receiptId]);

  let receipt;

  for (const chunk of receiptIdChunks) {
    try {
      receipt = await expo.getPushNotificationReceiptsAsync(chunk);
    } catch (error) {
      console.error(error);
    }
  }

  return receipt ? receipt[receiptId] : null;
};
module.exports = { sendNotification, getReceipt };
