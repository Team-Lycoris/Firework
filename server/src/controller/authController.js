import bcrypt from 'bcrypt';
import FireworkAuth from '../auth/fireworkAuth.js';
import UserHash from '../auth/userHash.js';
import User from '../database/user.js';

const saltRounds = 10;

export async function register(req, res, next) {
    try {
        const {username, password} = req.body;

        // Check the validity of the given username and password format
        if (!isValidUsername(username) || !isValidPassword(password)) {
            return res.json({status: false, msg: "Invalid username or password format"});
        }

        // Check that a user with the given username doesn't already exist in auth db
        const existingAuth = await UserHash.findOne({ where: { user: username }});
        if (existingAuth !== null) {
            return res.json({status: false, msg: "User already exists"});
        }

        // Check that a user with the given username doesn't already exist in data db
        const existingUser = await User.findOne({ where: { username: username }});
        if (existingUser !== null) {
            return res.json({status: false, msg: "User already exists"});
        }

        // Create a user in the data db
        const user = await User.create({ username: username, displayName: username });

        // Store the hashed version of the user's password
        const hash = await bcrypt.hash(password, saltRounds);
        const auth = await UserHash.create({ userId: user.id, username: username, hash: hash });

        console.log(user);

        // Create a JWT token for the user containing their id
        const token = await FireworkAuth.prototype.issueJWT(user.id);

        // Return the token to the user in the response
        return res.json({ status: true, token: token });
    } catch(ex) {
        next(ex);
    }
}

export async function login(req, res, next) {
    try {
        const {username, password} = req.body;

        // Check the validity of the given username and password format
        if (!isValidUsername(username) || !isValidPassword(password)) {
            return res.json({status: false, msg: "Invalid username or password format"});
        }

        // Check that a user with the given username exists in the auth db
        const authUser = await UserHash.findOne({ where: { username: username }});
        if (authUser === null) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        // Check that a user with the given username exists in the data db
        const user = await User.findOne({ where: { username: username }});
        if (user === null) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        // Compare the given password against the hashed version stored in the database
        const matched = await bcrypt.compare(password, authUser.hash);
        if (!matched) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        // Create a JWT token for the user containing their id
        const token = await FireworkAuth.prototype.issueJWT(user.id);

        // Return the token to the user in the response
        return res.json({status: true, token: token });
    } catch(ex) {
        next(ex);
    }
}

function isValidUsername(username) {
    // Check if the username starts with a character and consists of 1
    // to 30 alphanumeric characters and some special characters
    let regex = /^[a-zA-Z][a-zA-Z0-9._-]{0,29}$/
    return regex.test(username);
}

function isValidPassword(password) {
    // Check if the password consists of 8 to 30 letters, numbers, and special characters
    let regex1 = /^[a-zA-Z0-9\][~`!@#$%^&*()_+={}|\\;:"<>,.\/\?-]{8,30}$/
    // Check if the password contains at least one special character
    // let regex2 = /^.*[\][~`!@#$%^&*()_+={}|\\;:"<>,.\/\?-].*$/
    return regex1.test(password);
}
