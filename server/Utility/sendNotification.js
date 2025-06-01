// utils/sendNotification.js
import Notification from "../modal/Notification.js";

export const sendNotification = async ({ recipient, message, link = "" }) => {
  try {
    await Notification.create({ recipient, message, link });
  } catch (err) {
    console.error("Notification error:", err);
  }
};
