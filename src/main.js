import FireworkDatabase from "./database/fireworkDatabase.js"
import { Server } from 'socket.io';
import eventHandler from "./api/eventHandler.js";

// possibly destructive operation
// await db.sync({ alter: true })

await test();

async function test() {
	const db = new FireworkDatabase("sqlite", "db.sqlite");
	await db.sync({ force: true });

	const richard = await db.createUser("Richard");
	const group = await db.createGroup("gaming");
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
});