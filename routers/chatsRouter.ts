import { Router } from "express";
import { getChats, addChat, updateChat, deleteChat } from "../controllers/chatsController";
import passport from "passport";

const router = Router()

router.get("/api/chats", passport.authenticate("jwt", { session: false }), getChats)
router.post("/api/chats", passport.authenticate("jwt", { session: false }), addChat)
router.put("/api/chats/:id", passport.authenticate("jwt", { session: false }), updateChat)
router.delete("/api/chats/:id", passport.authenticate("jwt", { session: false }), deleteChat)

export default router