# Firework.Server

Setup:
1. Open a terminal and navigate to the server directory.
2. Run `npm install`
3. In the `src` directory, make a copy of `config.json.example` and name it `config.json`.
4. Edit `config.json` by supplying a string to use as the key used to sign JWTs. (For development purposes this can be pretty much any string.)
5. Run `node .` in the server directory to start the server.

Notes:
1. There exists code in `main.js` that resets the databases and creates test users, messages, conversations, etc.
2. The test users automatically created are `user: Richard, password: password` and `user: bobby, password: correcthorsebatterystaple`
3. If you register a new user and restart the server (such that the databases are reset), you will need to reset your JWT by either
manually deleting it from local storage, or manually going to `localhost:3000/login` and logging in or registering a new user.
