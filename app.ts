import express from 'express'
import * as path from 'path'
import cors from 'cors'
import passport from 'passport'
import { createServer } from 'http'
import { Response, Request } from 'express'
import { Server } from 'socket.io'

import usersRouter from './routers/usersRouter'
import chatsRouter from './routers/chatsRouter'

import sockets from './controllers/socketsController'

import { usersPassport } from './middleware/usersPassport'
import { createSecureServer } from 'http2'

declare const __dirname: string

const app = express()
const server = createServer(app)

app.use(cors())

app.use(passport.initialize())
usersPassport()

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://poligramm.vercel.app']
  }
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(usersRouter)
app.use(chatsRouter)

sockets(io)

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

const PORT: string | number = process.env.PORT || 4000

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
