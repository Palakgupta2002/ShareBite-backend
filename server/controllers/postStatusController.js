// Run this periodically via cron or scheduler
import Post from "../modal/Post.js";
import PostStatusHistory from "../modal/PostStatusHistory.js";
import Claim from "../modal/Claim.js";
import { sendNotification } from "../Utility/sendNotification.js";
import User from "../modal/User.js";
export const expireOldPosts = async (req, res) => {
  try {
    const expiredPosts = await Post.find({
      expiryDate: { $lt: new Date() },
      status: { $ne: "Expired" }
    });

    for (const post of expiredPosts) {
      post.status = "Expired";
      await post.save();

      await PostStatusHistory.create({
        post: post._id,
        status: "Expired"
      });
    }

    res.status(200).json({ message: `${expiredPosts.length} posts expired.` });
  } catch (error) {
    console.error("Error expiring posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markPickedUp = async (req, res) => {
  try {
    const { postId,userId } = req.params;


    
    const post = await Post.findById(postId);
    if (!post || post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post." });
    }

    post.status = "Picked Up";
    await post.save();

    await PostStatusHistory.create({ post: postId, status: "Picked Up" });

    res.status(200).json({ message: "Post marked as picked up." });
  } catch (error) {
    console.error("Error marking as picked up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markCompleted = async (req, res) => {
  try {
   const { postId,userId } = req.params;

    const claim = await Claim.findOne({ post: postId, claimer: userId, claimStatus: "Approved" });
    if (!claim) {
      return res.status(403).json({ message: "You haven't claimed this post or it's not approved." });
    }

    const post = await Post.findById(postId);
    if (post.status !== "Picked Up") {
      return res.status(400).json({ message: "Post must be marked as picked up first." });
    }

    post.status = "Completed";
    await post.save();

    await PostStatusHistory.create({ post: postId, status: "Completed" });

    res.status(200).json({ message: "Post marked as completed." });
  } catch (error) {
    console.error("Error marking as completed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
