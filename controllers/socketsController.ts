import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'

const prisma = new PrismaClient()

const sockets = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room)
      console.log(`User joined room ${room}`)
      console.log('___________________')
    })

    socket.on('userJoin', (room, user) => {
      socket.broadcast.to(room).emit('userJoin', user)
    })

    socket.on('message', async (message) => {
      io.to(message.uuid).emit('message', message)

      const chat = await prisma.chats.findFirst({
        where: {
          id: message.chatId
        },
        include: {
          messages: true
        }
      })

      if (chat) {
        const prismaMessage = await prisma.message.create({
          data: {
            chatId: message.chatId,
            userId: +message.userId,
            text: message.text,
            sendTime: message.sendTime,
            username: message.username,
            file: message.file,
            uuid: message.uuid
          }
        })

        console.log('prismaMessage', prismaMessage)
      }
    })

    // socket.on('message', newMessage => {
    //   io.to(newMessage.uuid).emit('message', newMessage.text, newMessage.id, newMessage.sendTime, newMessage.uuid, newMessage.username)
    //   console.log(newMessage);
    //   console.log(newMessage.text, newMessage.id, newMessage.username)
    // })

    socket.on('personalInvite', (uuid) => {
      socket.join(uuid)
      console.log(`User joined room ${uuid}`)
    })

    socket.on('messageInvite', (data) => {
      socket.broadcast
        .to(data.userUuid)
        .emit('messageInvite', data.uuidRoom, data.titleRoom, data.userUuid, data.roomId)
      console.log(
        `Пользователь ${data.userUuid} приглашен в комнату ${data.titleRoom} [${data.uuidRoom}]`
      )
    })
  })
}

export default sockets
