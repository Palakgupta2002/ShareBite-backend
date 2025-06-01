import express from "express";
import { getUserNotifications  } from "../controllers/notification.js";

const router = express.Router();


router.get("/", getUserNotifications);




export default router;
