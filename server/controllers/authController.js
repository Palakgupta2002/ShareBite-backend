// controllers/authController.js
import User from "../modal/User.js";   // ← Adjust this path if you named the folder `modal` instead of `models`
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// POST /api/auth/signup
export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // 1) Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // 2) Create new user (pre("save") hook hashes password)
    const user = await User.create({ name, email, password });

    // 3) Return basic info + JWT token
    return res.status(201).json({
      message: "User created successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Find user by email
    const user = await User.findOne({ email });
    // 2) If user doesn’t exist OR password doesn’t match
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    // 3) Otherwise, return user info + token
    return res.json({
        message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
