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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnaliseChat = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAnaliseChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const chat = yield prisma.chats.findUnique({
        where: {
            id
        },
        include: {
            messages: true
        }
    });
    if (chat) {
        let fileLength = 0;
        let textLength = 0;
        for (const element of chat.messages) {
            if (element.text.length) {
                textLength += 1;
            }
            if (element.file.length) {
                fileLength += 1;
            }
        }
        console.log('fileLength', fileLength);
        const analise = yield prisma.analise.create({
            data: {
                fileLength,
                textLength
            }
        });
        res.send(analise);
    }
});
exports.getAnaliseChat = getAnaliseChat;
