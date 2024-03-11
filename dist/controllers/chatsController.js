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
Object.defineProperty(exports, '__esModule', { value: true })
exports.deleteChat = exports.updateChat = exports.addChat = exports.getChats = void 0
const client_1 = require('@prisma/client')
const prisma = new client_1.PrismaClient()
const getChats = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const chats = yield prisma.chats.findMany()
      res.send(chats)
    } catch (error) {
      console.log(error)
    }
  })
exports.getChats = getChats
const addChat = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const chatData = req.body
      const chats = yield prisma.chats.create({
        data: Object.assign({}, chatData)
      })
      res.send(chats)
    } catch (error) {
      console.log(error)
    }
  })
exports.addChat = addChat
const updateChat = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const id = parseInt(req.params.id)
      const chatData = req.body
      const chats = yield prisma.chats.update({
        where: {
          id
        },
        data: Object.assign({}, chatData)
      })
      res.send(chats)
    } catch (error) {
      console.log(error)
    }
  })
exports.updateChat = updateChat
const deleteChat = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const id = parseInt(req.params.id)
      const chats = yield prisma.chats.delete({
        where: {
          id
        }
      })
      res.send(chats)
    } catch (error) {
      console.log(error)
    }
  })
exports.deleteChat = deleteChat
