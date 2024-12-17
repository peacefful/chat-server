"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateDatas_1 = require("../middleware/validateDatas");
const UsersController = __importStar(require("../controllers/usersController"));
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/api/users/:id', passport_1.default.authenticate('jwt', { session: false }), UsersController.getUser);
router.get('/api/users', UsersController.getUsers);
router.post('/api/users', (0, validateDatas_1.checkValidateDatas)('name', 2, 15), (0, validateDatas_1.checkValidateDatas)('surname', 2, 15), (0, validateDatas_1.checkValidateDatas)('login', 5, 15), (0, validateDatas_1.checkValidateDatas)('password', 8, 20), UsersController.addUser);
router.delete('/api/users/:id', passport_1.default.authenticate('jwt', { session: false }), UsersController.deleteUser);
router.post('/api/users/auth', UsersController.authUser);
router.post('/api/users/refresh', UsersController.refreshToken);
exports.default = router;
