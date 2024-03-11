'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.deleteUser =
  exports.authUser =
  exports.addUser =
  exports.getUser =
  exports.getUsers =
    void 0
const client_1 = require('@prisma/client')
const hashPasword_1 = require('../utils/hashPasword')
const bcrypt_1 = __importDefault(require('bcrypt'))
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'))
const key_1 = require('../config/key')
const uuid_1 = require('uuid')
const prisma = new client_1.PrismaClient()
const getUsers = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const user = yield prisma.user.findMany({
        include: {
          chats: true
        }
      })
      res.send(user)
    } catch (error) {
      console.log(error)
    }
  })
exports.getUsers = getUsers
const getUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const id = parseInt(req.params.id)
      const user = yield prisma.user.findUnique({
        where: {
          id
        },
        include: {
          chats: true
        }
      })
      res.send(user)
    } catch (error) {
      console.log(error)
    }
  })
exports.getUser = getUser
const addUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { name, surname, password, appointment, rank, login, phone, role } = req.body
      const hashedPassword = yield (0, hashPasword_1.hashPassword)(password)
      const createUser = yield prisma.user.create({
        data: {
          name,
          surname,
          appointment,
          rank,
          login,
          phone,
          role,
          uuid: (0, uuid_1.v4)(),
          password: hashedPassword
        }
      })
      res.send(createUser)
    } catch (error) {
      console.log(error)
    }
  })
exports.addUser = addUser
const authUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { login, password } = req.body
      const user = yield prisma.user.findFirst({
        where: { login }
      })
      if (user) {
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password)
        if (passwordMatch) {
          const token = jsonwebtoken_1.default.sign(
            {
              login,
              password
            },
            key_1.keyJwt,
            { expiresIn: '5h' }
          )
          res.status(200).json({
            token: `Bearer ${token}`,
            id: user.id,
            uuid: user.uuid
          })
        } else {
          throw new Error('Пароли не совпадают')
        }
      } else {
        throw new Error('Пользователь не найден')
      }
    } catch (error) {
      console.log(error)
    }
  })
exports.authUser = authUser
const deleteUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const id = parseInt(req.params.id)
      const user = yield prisma.user.delete({
        where: {
          id
        }
      })
      res.send(user)
    } catch (error) {
      console.log(error)
    }
  })
exports.deleteUser = deleteUser
