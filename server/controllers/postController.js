import Post from "../modal/Post.js";
import Claim from "../modal/Claim.js";
import { sendNotification } from "../Utility/sendNotification.js";
import User from "../modal/User.js";
import Rating from "../modal/Rating.js";


export const createPost = async (req, res) => {
  try {
    const {
      user,
      type,
      description,
      quantity,
      locationText,
      mapCoordinates,
      expiryDate,
    } = req?.body;

    console.log("Creating post with data:", req.body);

    // Validate required fields
    if (!user || !type || !description || !quantity || !expiryDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create a new post
    const newPost = new Post({
      user,
      type,
      description,
      quantity,
      locationText,
      mapCoordinates,
      expiryDate,
    });

    // Save the post to the database
    const savedPost = await newPost.save();
    const users = await User.find({ _id: { $ne: user } });
    for (const u of users) {
      await sendNotification({
        recipient: u._id,
        message: `New ${type.toLowerCase()} post available: "${description.slice(
          0,
          40
        )}..."`,
        link: `/posts/${savedPost._id}`,
      });
    }

    res
      .status(201)
      .json({ message: "Post created successfully", post: savedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((post) => post._id);

    // Fetch all claims
    const allClaims = await Claim.find({
      post: { $in: postIds },
    })
      .populate("claimer", "name email")
      .lean();

    // Filter only approved claims
    const approvedClaims = allClaims.filter(
      (claim) => claim.claimStatus === "Approved"
    );

    // Fetch ratings
    const ratings = await Rating.find({
      post: { $in: postIds },
    })
      .populate("rater", "name email")
      .lean();

    // Map posts with associated claims, ratings, and claim IDs
    const postsWithDetails = posts.map((post) => {
      const approvedClaim = approvedClaims.find(
        (claim) => claim.post.toString() === post._id.toString()
      );

      const postRatings = ratings.filter(
        (rating) => rating.post.toString() === post._id.toString()
      );

      const postClaimIds = allClaims
        .filter((claim) => claim.post.toString() === post._id.toString())
        .map((claim) => claim._id); // Just IDs — or return full claims if needed

      return {
        ...post,
        approvedClaim: approvedClaim || null,
        ratings: postRatings || [],
        claimIds: postClaimIds || [],
      };
    });

    res.status(200).json(postsWithDetails);
  } catch (error) {
    console.error("Error fetching posts with claims and ratings:", error);
    res.status(500).json({ message: "Failed to fetch posts." });
  }
};

export const getPostsByUser = async (req, res) => {
  const { userId } = req?.params;
  try {
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user's posts." });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req?.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found." });
    await sendNotification({
      recipient: updatedPost.user,
      message: `Your post "${updatedPost.description.slice(
        0,
        40
      )}..." was updated.`,
      link: `/posts/${updatedPost._id}`,
    });

    res.status(200).json({ message: "Post updated.", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post." });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req?.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found." });
    await sendNotification({
      recipient: deletedPost.user,
      message: `Your post "${deletedPost.description.slice(
        0,
        40
      )}..." was deleted.`,
    });

    res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post." });
  }
};

export const getUserPostsWithDetails = async (req, res) => {
  const { userId } = req?.query;

  try {
    // Get all posts by this user
    const posts = await Post.find({ user: userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((post) => post._id);

    // Get all ratings (including comments) for those posts
    const ratings = await Rating.find({ post: { $in: postIds } })
      .populate("rater", "name email")
      .lean();

    const enrichedPosts = posts.map((post) => {
      const postRatings = ratings.filter(
        (rating) => rating.post.toString() === post._id.toString()
      );

      const comments = postRatings.filter((rating) => rating.comment);

      return {
        ...post,
        ratings: postRatings,
        comments,
      };
    });

    res.status(200).json(enrichedPosts);
  } catch (error) {
    console.error("Error fetching user posts with ratings/comments:", error);
    res.status(500).json({ message: "Failed to fetch user posts." });
  }
};
