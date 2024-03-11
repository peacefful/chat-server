'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const usersController_1 = require('../controllers/usersController')
const router = (0, express_1.Router)()
router.get('/api/users/:id', usersController_1.getUser)
router.get('/api/users', usersController_1.getUsers)
router.post('/api/users', usersController_1.addUser)
router.post('/api/auth', usersController_1.authUser)
router.delete('/api/users/:id', usersController_1.deleteUser)
exports.default = router
