import express from "express";
import {
  createContactMessage,
  getContactMessages,
  replyToContactMessage,
} from "../controllers/contactController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", protectAdmin, getContactMessages);
router.post("/:id/reply", protectAdmin, replyToContactMessage);

export default router;
