import express from "express";
import {
  submitContactMessage,
  getContactMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/contactController.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", contactLimiter, submitContactMessage);
router.get("/", getContactMessages);
router.patch("/:id/read", markMessageRead);
router.delete("/:id", deleteMessage);

export default router;

