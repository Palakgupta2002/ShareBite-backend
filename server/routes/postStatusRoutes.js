import express from "express";
import {
    markCompleted,
    markPickedUp,
    expireOldPosts
 
} from "../controllers/postStatusController.js";

const router = express.Router();
router.get("/mark-completed/:postId/:userId", markCompleted);
router.get("/mark-picked-up/:postId/:userId", markPickedUp);
router.post("/expire-old-posts", expireOldPosts);



export default router;
