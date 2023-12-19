import { Router } from 'express'
import { getUser, addUser, authUser, getUsers, deleteUser } from '../controllers/usersController'
import passport from "passport";

const router = Router()

router.get('/api/users/:id', passport.authenticate("jwt", { session: false }), getUser)
router.get('/api/users', getUsers)
router.post('/api/users', passport.authenticate("jwt", { session: false }), addUser)
router.post('/api/auth', authUser)
router.delete('/api/users/:id', passport.authenticate("jwt", { session: false }), deleteUser)

export default router
