// routes/ratingRoutes.js
import express from "express";
import { postRating } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/", postRating); // POST /api/ratings/rate

export default router;
