import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'

const prisma = new PrismaClient()

const sockets = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room)
      // console.log(`User joined room ${room}`)
      // console.log('___________________')
    })

    socket.on('userJoin', (room, user) => {
      socket.broadcast.to(room).emit('userJoin', user)
    })

    socket.on('message', async (message) => {
      io.to(message.uuid).emit('message', message)

      console.log('message', message);
      console.log('adminId', message.adminId);

      const chat = await prisma.chats.findFirst({
        where: {
          userId: message.adminId,
          uuid: message.uuid
        }
      })

      console.log('admin chat', chat);

      if (chat) {
        await prisma.message.create({
          data: {
            chatId: chat.id,
            userId: +message.userId,
            text: message.text,
            sendTime: message.sendTime,
            username: message.username,
            file: message.file,
            uuid: message.uuid
          }
        })
      }
    })

    // socket.on('message', newMessage => {
    //   io.to(newMessage.uuid).emit('message', newMessage.text, newMessage.id, newMessage.sendTime, newMessage.uuid, newMessage.username)
    //   console.log(newMessage);
    //   console.log(newMessage.text, newMessage.id, newMessage.username)
    // })

    socket.on('personalInvite', (uuid) => {
      socket.join(uuid)
      // console.log(`User joined room ${uuid}`)
    })

    socket.on('saveChat', async (adminId, userId, uuid) => {
      console.log(`adminId ${adminId}`)
      console.log(`uuid ${uuid}`)

      const chat = await prisma.chats.findFirst({
        where: {
          adminId: adminId,
          uuid
        },
        include: {
          messages: true
        }
      })

      console.log('save chat', chat);

      if (chat) {
        await prisma.chats.create({
          data: {
            uuid: chat.uuid,
            roomName: chat.roomName,
            description: chat.description,
            userId,
            adminId: chat.adminId,
            messages: {
              create: chat.messages.map(({ id, chatId, ...message }) => message)
            }
          }
        })  
      }

      // console.log('chat', chat);
      
    })

    socket.on('messageInvite', async (data) => {
      // console.log('invite data', data);
      

      socket.broadcast
        .to(data.userUuid)
        .emit('messageInvite', data.uuidRoom, data.titleRoom, data.userUuid, data.roomId, data.adminId)
      // console.log(
      //   `Пользователь ${data.userUuid} приглашен в комнату ${data.titleRoom} [${data.uuidRoom}]`
      // )
    })
  })
}

export default sockets
