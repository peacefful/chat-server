import express from 'express'
import * as path from 'path'
import { createServer } from 'http'
import { Response, Request } from 'express'
import { Server } from 'socket.io'
import cors from 'cors'

import usersRouter from './routers/usersRouter'

declare const __dirname: string

const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8100'
  }
})

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(usersRouter)

io.on('connection', (socket) => {
  console.log('User connected')
  socket.on('join', (room) => {
    socket.join(room)
    console.log(`User joined room ${room}`)
  })
  socket.on('message', (room, message, username, id) => {
    io.to(room).emit('message', message, username, id)
    console.log('Message', message)
  })
})

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000')
})
