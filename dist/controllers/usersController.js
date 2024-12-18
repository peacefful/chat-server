"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.authUser = exports.deleteUser = exports.addUser = exports.getUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const hashPasword_1 = require("../utils/hashPasword");
const key_1 = require("../config/key");
const uuid_1 = require("uuid");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findMany({
            include: {
                chats: true
            }
        });
        res.send(user);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const user = yield prisma.user.findUnique({
            where: {
                id
            },
            include: {
                chats: true
            }
        });
        res.send(user);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUser = getUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            const { name, surname, password, login } = req.body;
            const hashedPassword = yield (0, hashPasword_1.hashPassword)(password);
            const createUser = yield prisma.user.create({
                data: {
                    name,
                    surname,
                    login,
                    password: hashedPassword,
                    uuid: (0, uuid_1.v4)()
                }
            });
            res.send(createUser);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.addUser = addUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const user = yield prisma.user.delete({
            where: {
                id
            }
        });
        res.send(user);
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteUser = deleteUser;
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, password } = req.body;
        const user = yield prisma.user.findFirst({
            where: { login }
        });
        if (user) {
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (passwordMatch) {
                const accessToken = jsonwebtoken_1.default.sign({
                    id: user.id,
                    login,
                    password
                }, key_1.keyJwt, { expiresIn: '3h' });
                const refreshToken = jsonwebtoken_1.default.sign({
                    id: user.id,
                    login,
                    password
                }, key_1.keyJwt, { expiresIn: '2d' });
                res.status(200).json({
                    refreshToken,
                    accessToken,
                    id: user.id,
                    uuid: user.uuid
                });
            }
            else {
                res.status(401).json({
                    message: 'Пароли не совпадают'
                });
            }
        }
        else {
            res.status(404).json({
                message: 'Пользователь не найден'
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.authUser = authUser;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                message: 'Отсутствует refreshToken'
            });
        }
        jsonwebtoken_1.default.verify(refreshToken, key_1.keyJwt, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(401).json({
                    message: 'Неверный или истекший refreshToken'
                });
            }
            const user = yield prisma.user.findUnique({
                where: { id: decoded.id }
            });
            if (!user) {
                return res.status(404).json({
                    message: 'Пользователь не найден'
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({
                id: user.id,
                login: user.login
            }, key_1.keyJwt, { expiresIn: '2m' });
            const newRefreshToken = jsonwebtoken_1.default.sign({
                id: user.id,
                login: user.login
            }, key_1.keyJwt, { expiresIn: '7d' });
            res.status(200).json({
                accessToken,
                refreshToken: newRefreshToken
            });
        }));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});
exports.refreshToken = refreshToken;
