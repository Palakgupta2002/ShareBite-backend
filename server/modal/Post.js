import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Donate", "Request"], required: true },
  description: { type: String, required: true },
  quantity: { type: String, required: true },
  locationText: { type: String },
  mapCoordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  expiryDate: { type: Date, required: true },
  status: { type: String, default: "Posted" },
  
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
