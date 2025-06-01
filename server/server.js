import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser"
import dotenv from 'dotenv';
import cors from "cors"
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import postStatusRoutes from "./routes/postStatusRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";


dotenv.config();


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/claims", claimRoutes);
app.use("/api/post-status", postStatusRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ratings", ratingRoutes);

// Register your postRoutes under /api/posts
app.use("/api/posts", postRoutes);


app.get('/', (req, res) => {
    res.json({ message: "Welcome to Food share Website." });
});

app.listen(5000, () => {
    console.log(`App listening on port 5000`);
});