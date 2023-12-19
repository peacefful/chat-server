import express from 'express'
import * as path from 'path'
import { createServer } from 'http'
import { Response, Request } from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import passport from "passport"

import usersRouter from './routers/usersRouter'
import chatsRouter from './routers/chatsRouter'

import { usersPassport } from "./middleware/usersPassport"

declare const __dirname: string

const app = express()
const server = createServer(app)

app.use(cors())

app.use(passport.initialize())
usersPassport()

const io = new Server(server, {
	cors: {
		origin: ['http://localhost:5173', 'https://poligramm.kz']
	}
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(usersRouter)
app.use(chatsRouter)

io.on('connection', (socket) => {
	socket.on('join', (room) => {
		socket.join(room);
		console.log(`User ${socket.id} joined room ${room}`);
	});

	socket.on('message', (message, id, time, uuid) => {
		io.to(uuid).emit('message', message, id, time);
		console.log(message, id, time);
	});

	socket.on('personalInvite', (uuid) => {
		socket.join(uuid);
		console.log(`User joined room ${uuid}`);
	});

	socket.on('messageInvite', (data) => {
		socket.broadcast.to(data.userUuid).emit('messageInvite', data.uuidRoom, data.nameRoom);
		console.log(`Сообщение ${data.nameRoom} в комнате ${data.uuidRoom}`);
	});
});

app.get('/', (req: Request, res: Response) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

const PORT:string|number = process.env.PORT || 3000

server.listen(PORT, () => {
	console.log(`server running at http://localhost:${PORT}`)
})