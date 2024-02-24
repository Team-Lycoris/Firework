import FireworkDatabase from "./database/fireworkDatabase.js"


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
