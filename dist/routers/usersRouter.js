"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
const passport_1 = __importDefault(require("passport"));
const validateDatas_1 = require("../middleware/validateDatas");
const router = (0, express_1.Router)();
router.get('/api/users/:id', passport_1.default.authenticate('jwt', { session: false }), usersController_1.getUser);
router.get('/api/users', usersController_1.getUsers);
router.post('/api/users', (0, validateDatas_1.checkValidateDatas)('name', 2, 15), (0, validateDatas_1.checkValidateDatas)('surname', 2, 15), (0, validateDatas_1.checkValidateDatas)('login', 5, 15), (0, validateDatas_1.checkValidateDatas)('password', 8, 20), usersController_1.addUser);
router.delete('/api/users/:id', passport_1.default.authenticate('jwt', { session: false }), usersController_1.deleteUser);
router.post('/api/users/auth', usersController_1.authUser);
router.post('/api/users/auth/refresh', usersController_1.refreshToken);
exports.default = router;
