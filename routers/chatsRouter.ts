import { Router } from "express";
import { getChats, addChat, updateChat, deleteChat } from "../controllers/chatsController";

const router = Router()

router.get("/api/chats", getChats)
router.post("/api/chats", addChat)
router.put("/api/chats/:id", updateChat)
router.delete("/api/chats/:id", deleteChat)

export default router