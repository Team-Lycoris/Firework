import bcrypt from 'bcrypt';
import User from "../database/user.js";

const saltRounds = 10;

export async function register(req, res, next) {
    try {
        console.log(req);

        const existingUser = await User.findOne({ where: { name: req.body.username }});
        if (existingUser !== null) {
            return res.json({status: false, msg: "User already exists"});
        }
        const passwordHash = bcrypt.hash(req.body.password, saltRounds);

        const user = await User.createUser(req.body.username, passwordHash);

        return res.json({ status: true });
    } catch(ex) {
        next(ex);
    }
}

export async function login(req, res, next) {
    try {
        console.log(req);

        const user = await User.findOne({ where: {name: req.body.username }});
        if (!user) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        const matched = await bcrypt.compare(req.body.password, user.passwordHash);
        if (!matched) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        return res.json({status: true });
    } catch(ex) {
        next(ex);
    }
}
