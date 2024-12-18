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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const sockets = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (room) => {
            socket.join(room);
            console.log(`User joined room ${room}`);
            console.log('___________________');
        });
        socket.on('userJoin', (room, user) => {
            socket.broadcast.to(room).emit('userJoin', user);
        });
        socket.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            io.to(message.uuid).emit('message', message);
            const chat = yield prisma.chats.findFirst({
                where: {
                    id: message.chatId
                },
                include: {
                    messages: true
                }
            });
            if (chat) {
                const prismaMessage = yield prisma.message.create({
                    data: {
                        chatId: message.chatId,
                        userId: +message.userId,
                        text: message.text,
                        sendTime: message.sendTime,
                        username: message.username,
                        file: message.file,
                        uuid: message.uuid
                    }
                });
                console.log('prismaMessage', prismaMessage);
            }
        }));
        // socket.on('message', newMessage => {
        //   io.to(newMessage.uuid).emit('message', newMessage.text, newMessage.id, newMessage.sendTime, newMessage.uuid, newMessage.username)
        //   console.log(newMessage);
        //   console.log(newMessage.text, newMessage.id, newMessage.username)
        // })
        socket.on('personalInvite', (uuid) => {
            socket.join(uuid);
            console.log(`User joined room ${uuid}`);
        });
        socket.on('messageInvite', (data) => {
            socket.broadcast
                .to(data.userUuid)
                .emit('messageInvite', data.uuidRoom, data.titleRoom, data.userUuid, data.roomId);
            console.log(`Пользователь ${data.userUuid} приглашен в комнату ${data.titleRoom} [${data.uuidRoom}]`);
        });
    });
};
exports.default = sockets;
