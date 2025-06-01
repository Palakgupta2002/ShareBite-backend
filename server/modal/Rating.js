import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  rater: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ratee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  ratedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Rating", ratingSchema);
