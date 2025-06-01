import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  claimer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  claimStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  claimDate: { type: Date, default: Date.now },
  approvedByOwner: { type: Boolean, default: false },

  // Add Claimer Location
  deliveryLocationText: { type: String, required: true }, // Human-readable address

});

export default mongoose.model("Claim", claimSchema);
