"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sockets = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (room) => {
            socket.join(room);
            console.log(`User joined room ${room}`);
        });
        socket.on('userJoin', (room, user) => {
            socket.broadcast.to(room).emit('userJoin', user);
        });
        socket.on('message', (text, id, sendTime, uuid, username) => {
            io.to(uuid).emit('message', text, id, sendTime, uuid, username);
            console.log(text, id, username);
        });
        socket.on('personalInvite', (uuid) => {
            socket.join(uuid);
            console.log(`User joined room ${uuid}`);
        });
        socket.on('messageInvite', (data) => {
            socket.broadcast
                .to(data.userUuid)
                .emit('messageInvite', data.uuidRoom, data.titleRoom, data.userUuid);
            console.log(`Пользователь ${data.userUuid} приглашен в комнату ${data.titleRoom} [${data.uuidRoom}]`);
        });
    });
};
exports.default = sockets;
