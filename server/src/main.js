import FireworkDatabase from "./database/fireworkDatabase.js"
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import eventHandler from "./api/eventHandler.js";
import loginHandler from './api/loginHandler.js';
import router from "./routes/routes.js";

// possibly destructive operation
// await db.sync({ alter: true })

const db = new FireworkDatabase("sqlite", "db.sqlite");
await db.sync({ force: true });

//await test();

async function test() {
	const richard = await db.createUser("Richard");
	const group = await db.createGroup("gaming");
	await group.addUser(richard);

	await richard.sendMessage("hello gamers and non-gamers", group);
}

const PORT = 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', router);

const server = app.listen(PORT, () => {
	console.log('Server started on port', PORT);
});

const io = new Server(server);

io.on('connection', (socket) => {
	console.log("Client connected");

	socket.join('ch-1');
	socket.data.active_channel = 1;

	eventHandler(io, socket);
	loginHandler(io, socket, db);
});