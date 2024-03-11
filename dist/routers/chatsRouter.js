'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const chatsController_1 = require('../controllers/chatsController')
const router = (0, express_1.Router)()
router.get('/api/chats', chatsController_1.getChats)
router.post('/api/chats', chatsController_1.addChat)
router.put('/api/chats/:id', chatsController_1.updateChat)
router.delete('/api/chats/:id', chatsController_1.deleteChat)
exports.default = router
