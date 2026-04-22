import express from "express";
import {
  createContactMessage,
  getContactMessages,
  replyToContactMessage,
  updateContactStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", protectAdmin, getContactMessages);
router.post("/:id/reply", protectAdmin, replyToContactMessage);
router.patch("/:id/status", protectAdmin, updateContactStatus);
router.delete("/:id", protectAdmin, deleteContactMessage);

export default router;
