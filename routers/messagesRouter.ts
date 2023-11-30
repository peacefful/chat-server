import { Router } from "express";
import { getMessages } from "../controllers/messagesController";

const router = Router()

router.get("/api/messages", getMessages)

export default router