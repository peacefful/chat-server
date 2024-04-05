"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatsController_1 = require("../controllers/chatsController");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/api/chats', passport_1.default.authenticate('jwt', { session: false }), chatsController_1.getChats);
router.post('/api/chats', passport_1.default.authenticate('jwt', { session: false }), chatsController_1.addChat);
router.put('/api/chats/:id', passport_1.default.authenticate('jwt', { session: false }), chatsController_1.updateChat);
router.delete('/api/chats/:id', passport_1.default.authenticate('jwt', { session: false }), chatsController_1.deleteChat);
exports.default = router;
