import { Router } from 'express'
import { getUsers, addUser, authUser } from '../controllers/usersController'

const router = Router()

router.get('/api/users', getUsers)
router.post('/api/users', addUser)
router.post('/api/auth', authUser)

export default router
