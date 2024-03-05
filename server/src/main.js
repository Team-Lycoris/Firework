import FireworkDatabase from "./database/fireworkDatabase.js"
import { Server } from 'socket.io';
import eventHandler from "./api/eventHandler.js";
import loginHandler from './api/loginHandler.js';

import User from "./database/user.js";
import Group from "./database/group.js";
import Message from "./database/message.js";

// possibly destructive operation
// await db.sync({ alter: true })

const db = new FireworkDatabase("sqlite", "db.sqlite");
await db.sync({ force: true });

await test();

async function test() {
	const richard = await User.createUser("Richard", "yeet");
	const group = await Group.createGroup("gaming");
	await group.addUser(richard);

	await richard.sendMessage("hello gamers and non-gamers", group);
}

const io = new Server(8080, {
	cors: {
		origin: "http://localhost:3000"
	}
});

io.on('connection', (socket) => {
	console.log("Client connected");

	socket.join('ch-1');
	socket.data.active_channel = 1;

	eventHandler(io, socket);
	loginHandler(io, socket, db);
});
