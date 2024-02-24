import FireworkDatabase from "./database/database.js"

const db = new FireworkDatabase("sqlite", "db.sqlite");

// possibly destructive operation
// await db.sync({ alter: true })
