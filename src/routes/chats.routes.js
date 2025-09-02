import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createChat,
  myChats,
  listMessages,
  sendMessage,
} from "../../controllers/chats.controller.js";

const router = Router();

router.post("/:peerId", requireAuth, createChat);
router.get("/", requireAuth, myChats);
router.get("/:chatId/messages", requireAuth, listMessages);
router.post("/:chatId/messages", requireAuth, sendMessage);

export default router;
