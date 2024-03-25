import { Router } from 'express'
import { getUser, addUser, authUser, getUsers, deleteUser, refreshToken } from '../controllers/usersController'
import passport from 'passport'
import { checkValidateDatas } from '../middleware/validateDatas'

const router = Router()

router.get('/api/users/:id', passport.authenticate('jwt', { session: false }), getUser)
router.get('/api/users', getUsers)
router.post(
  '/api/users',
  checkValidateDatas('name', 2, 15),
  checkValidateDatas('surname', 2, 15),
  checkValidateDatas('login', 5, 15),
  checkValidateDatas('password', 8, 20),
  addUser
)
router.delete('/api/users/:id', passport.authenticate('jwt', { session: false }), deleteUser)
router.post('/api/users/auth', authUser)
router.post('/api/users/auth/refresh', refreshToken)

export default router
