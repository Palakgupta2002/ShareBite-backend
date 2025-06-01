// routes/notifications.js or controller
import Notification from "../modal/Notification.js";

export const getUserNotifications = async (req, res) => {
  const { userId } = req.query;

  try {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
