import { Chat } from "../src/models/Chat.js";
import { Message } from "../src/models/Message.js";
import { HttpError } from "../src/utils/error.js";

export async function createChat(req, res, next) {
  try {
    const peerId = req.params.peerId;
    if (String(peerId) === String(req.user.id))
      throw new HttpError(400, "Cannot chat with yourself");
    let chat = await Chat.findOne({ members: { $all: [req.user.id, peerId] } });
    if (!chat) chat = await Chat.create({ members: [req.user.id, peerId] });
    res.status(201).json({ chat });
  } catch (e) {
    next(e);
  }
}

export async function myChats(req, res, next) {
  try {
    const chats = await Chat.find({ members: req.user.id }).populate(
      "members",
      "name avatarUrl"
    );
    res.json({ chats });
  } catch (e) {
    next(e);
  }
}

export async function listMessages(req, res, next) {
  try {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.user.id))
      throw new HttpError(404, "Chat not found");
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name avatarUrl")
      .sort({ createdAt: 1 });
    res.json({ messages });
  } catch (e) {
    next(e);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.user.id))
      throw new HttpError(404, "Chat not found");
    const { text } = req.body;
    if (!text) throw new HttpError(400, "Message text required");
    const msg = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text,
    });
    res.status(201).json({ message: msg });
  } catch (e) {
    next(e);
  }
}
