import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import eventHandler from "./api/eventHandler.js";
import loginHandler from './api/loginHandler.js';
import router from "./routes/routes.js";

import FireworkDatabase from "./database/fireworkDatabase.js"
import User from "./database/user.js";
import Group from "./database/group.js";
import Message from "./database/message.js";

import FireworkAuth from './auth/fireworkAuth.js';

const db = new FireworkDatabase("sqlite", "db.sqlite");
await db.sync({ force: true });

const auth = new FireworkAuth("sqlite", "auth.sqlite");
await auth.sync({ force: true });

await test();

async function test() {
	const richard = await User.createUser("Richard", "Richard", "yeet");
	await auth.registerUser(richard.id, "password");
	const group = await Group.createGroup("gaming");
	await group.addUser(richard);

	await richard.sendMessage("hello gamers and non-gamers", group);
	await richard.sendMessage("test", group);
	await richard.sendMessage("yup", group);

	const bobby = await User.createUser("bobby", "bobby", "yeet");
	await auth.registerUser(bobby.id, "correcthorsebatterystaple");
	await group.addUser(bobby);
	await bobby.sendMessage("testtsetset", group);

	const event = await bobby.createEvent("gamer meetup", "1234 Gaming St.", -1, 123456);
	bobby.sendMessage("guys gamer meetup", group, event.id);

	const richardJWT = await auth.issueJWT(richard.id, "password");
	console.log(auth.verifyJWT(richardJWT));
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
