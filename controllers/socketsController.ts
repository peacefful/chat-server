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

    socket.on('closeChatByUuid', async ({ adminId, userUuid }) => {
      console.log('closeChatByUuid', adminId, userUuid)

      try {
        const currentChat = await prisma.chats.findFirst({
          where: {
            adminId
          }
        })

        const joinedUsersIds = currentChat?.joinedUsersIds?.filter((uuid) => uuid !== userUuid)

        await prisma.chats.update({
          where: {
            id: currentChat?.id
          },
          data: {
            joinedUsersIds: joinedUsersIds
          }
        })
      } catch (error) {
        console.log('Error closing chat:', error)
      }
    })

    socket.on('message', async (message) => {
      io.to(message.uuid).emit('message', message)

      console.log('message', message)

      // console.log('message', message)
      // console.log('adminId', message.adminId)

      // console.log('test')

      const chat = await prisma.chats.findFirst({
        where: {
          userId: message.adminId,
          uuid: message.uuid
        }
      })

      // console.log('admin chat', chat)

      if (chat) {
        await prisma.message.create({
          data: {
            chatId: chat.id,
            sendDate: message.sendDate,
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

    socket.on('saveChat', async (adminId, userId, uuid, callback) => {
      console.log(`adminId ${adminId}`)
      // console.log(`uuid ${uuid}`)

      try {
        const chat = await prisma.chats.findFirst({
          where: {
            adminId: adminId,
            uuid
          },
          include: {
            messages: true
          }
        })

        if (chat) {
          const userChat = await prisma.chats.create({
            data: {
              uuid: chat.uuid,
              roomName: chat.roomName,
              description: chat.description,
              userId,
              joinedUsersIds: chat.joinedUsersIds,
              adminId: chat.adminId,
              messages: {
                create: chat.messages.map(({ id, chatId, ...message }) => message)
              }
            }
          })
          await callback({ id: userChat.id })
        }
      } catch (error) {
        console.log(error)
      }

      // console.log('chat', chat);
    })

    socket.on('messageInvite', async (data) => {
      socket.broadcast
        .to(data.userUuid)
        .emit(
          'messageInvite',
          data.uuidRoom,
          data.titleRoom,
          data.userUuid,
          data.roomId,
          data.adminId
        )

      const chat = await prisma.chats.findFirst({
        where: {
          id: data.roomId
        },
        include: {
          messages: true
        }
      })

      if (chat?.id) {
        await prisma.chats.update({
          where: {
            id: data.roomId
          },
          data: {
            joinedUsersIds: [...chat.joinedUsersIds, data.userUuid]
          }
        })
      }

      // console.log(
      //   `Пользователь ${data.userUuid} приглашен в комнату ${data.titleRoom} [${data.uuidRoom}]`
      // )
    })
  })
}

export default sockets
