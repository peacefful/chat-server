import { Router } from 'express'
import { getUser, addUser, authUser, getUsers, deleteUser } from '../controllers/usersController'

const router = Router()

router.get('/api/users/:id', getUser)
router.get('/api/users', getUsers)
router.post('/api/users', addUser)
router.post('/api/auth', authUser)
router.delete('/api/users/:id', deleteUser)

export default router
