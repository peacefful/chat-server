import express from 'express';
import * as path from 'path'
import { createServer } from 'http';
import { Response, Request } from "express";
import { Server } from 'socket.io';

declare const __dirname: string

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:8100"
	}
});

app.use(express.static('public'))

io.on('connection', (socket) => {
	socket.on('chat message', (msg) => {
	  io.emit('chat message', msg);
	});
});

app.get('/', (req: Request, res: Response) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
