import express from "express";
import { claimPost,viewClaimsForPost,approveClaim,markPickedUp } from "../controllers/claimController.js";

const router = express.Router();

// POST /api/claims - Claim a post
router.post("/", claimPost);
router.get("/:postId", viewClaimsForPost);
router.patch("/:claimId/approve", approveClaim);
router.patch("/:claimId/pickup", markPickedUp);



export default router;
