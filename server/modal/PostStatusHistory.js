import mongoose from "mongoose";

const postStatusHistorySchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  status: {
    type: String,
    enum: ["Posted", "Claimed", "Picked Up", "Completed", "Expired"],
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("PostStatusHistory", postStatusHistorySchema);
