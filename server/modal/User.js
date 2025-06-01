// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  totalDonations: { 
    type: Number, 
    default: 0 
  },
  totalRequests: { 
    type: Number, 
    default: 0 
  },
  joinDate: { 
    type: Date, 
    default: Date.now 
  }
});

// ─── HASH PASSWORD BEFORE SAVING ────────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash if password was modified or it's a new document
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// ─── INSTANCE METHOD TO COMPARE PASSWORDS ───────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
