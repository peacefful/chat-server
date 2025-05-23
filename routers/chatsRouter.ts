import { Router } from 'express'
import * as ChatController from '../controllers/chatsController'
import * as AnaliseController from '../controllers/analise'
import passport from 'passport'

const router = Router()

router.get('/api/chats', passport.authenticate('jwt', { session: false }), ChatController.getChats)
router.post(
  '/api/chats/:id',
  passport.authenticate('jwt', { session: false }),
  ChatController.getChat
)
router.post('/api/chats', passport.authenticate('jwt', { session: false }), ChatController.addChat)
router.put(
  '/api/chats/:id',
  passport.authenticate('jwt', { session: false }),
  ChatController.updateChat
)
router.delete(
  '/api/chats/:id',
  passport.authenticate('jwt', { session: false }),
  ChatController.deleteChat
)

router.post('/api/analise/:id', AnaliseController.getAnaliseChat)

export default router
