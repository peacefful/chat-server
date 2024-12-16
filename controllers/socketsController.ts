import { Server } from 'socket.io'

const sockets = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room)
      console.log(`User joined room ${room}`)
      console.log("___________________");
    })

    socket.on('userJoin', (room, user) => {
      socket.broadcast.to(room).emit('userJoin', user)
    })

    socket.on('message', message => {
      io.to(message.uuid).emit('message', message)
      console.log('m', message)
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