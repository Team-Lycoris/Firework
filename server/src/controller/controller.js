import bcrypt from 'bcrypt';
import UserHash from '../auth/userHash.js';

const saltRounds = 10;

export async function register(req, res, next) {
    try {
        const {username, password} = req.body;
        if (!isValidUsername(username) || !isValidPassword(password)) {
            return res.json({status: false, msg: "Invalid username or password"});
        }

        const existingUser = await UserHash.findOne({ where: { user: username }});
        if (existingUser !== null) {
            return res.json({status: false, msg: "User already exists"});
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const user = await UserHash.create({user: username, hash: hash});

        return res.json({ status: true });
    } catch(ex) {
        next(ex);
    }
}

export async function login(req, res, next) {
    try {
        const {username, password} = req.body;
        if (!isValidUsername(username) || !isValidPassword(password)) {
            return res.json({status: false, msg: "Invalid username or password"});
        }

        const user = await UserHash.findOne({ where: {user: username }});
        if (!user) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        const matched = await bcrypt.compare(password, user.hash);
        if (!matched) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        return res.json({status: true });
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
