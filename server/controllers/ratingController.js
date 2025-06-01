// controllers/ratingController.js
import Rating from "../modal/Rating.js";
import Post from "../modal/Post.js";
import User from "../modal/User.js";

export const postRating = async (req, res) => {
  try {
    const { rater, ratee, post, rating, comment } = req.body;

    if (!rater || !ratee || !post || !rating) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (rater === ratee) {
      return res.status(400).json({ message: "You cannot rate yourself." });
    }

    // Optional: Check if post exists and both users exist
    const [postExists, raterExists, rateeExists] = await Promise.all([
      Post.findById(post),
      User.findById(rater),
      User.findById(ratee),
    ]);

    if (!postExists || !raterExists || !rateeExists) {
      return res.status(404).json({ message: "Post or users not found." });
    }

    // Optional: Prevent duplicate ratings for the same post by the same rater
    const existingRating = await Rating.findOne({ rater, ratee, post });
    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this user for this post." });
    }

    const newRating = new Rating({ rater, ratee, post, rating, comment });
    await newRating.save();

    res.status(201).json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    console.error("Error posting rating:", error);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};
