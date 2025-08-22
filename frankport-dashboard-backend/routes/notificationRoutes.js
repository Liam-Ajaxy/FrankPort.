import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router()// GET  /api/notifications
router.get("/", getNotifications);

// PATCH /api/notifications/:id/read
id/read
router.patch("/:id/read", markAsRead);

export default roter;
