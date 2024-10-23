import { Router } from 'express'
import { checkValidateDatas } from '../middleware/validateDatas'
import * as UsersController from '../controllers/usersController'
import passport from 'passport'

const router = Router()

router.get('/api/users/:id', passport.authenticate('jwt', { session: false }), UsersController.getUser)
router.get('/api/users', UsersController.getUsers)
router.post(
  '/api/users',
  checkValidateDatas('name', 2, 15),
  checkValidateDatas('surname', 2, 15),
  checkValidateDatas('login', 5, 15),
  checkValidateDatas('password', 8, 20),
  UsersController.addUser
)
router.delete('/api/users/:id', passport.authenticate('jwt', { session: false }), UsersController.deleteUser)
router.post('/api/users/auth', UsersController.authUser)
router.post('/api/users/refresh', UsersController.refreshToken)

export default router
