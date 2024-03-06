import bcrypt from 'bcrypt';
import UserHash from '../auth/userHash.js';

const saltRounds = 10;

export async function register(req, res, next) {
    try {
        console.log(req);

        const existingUser = await UserHash.findOne({ where: { user: req.body.username }});
        if (existingUser !== null) {
            return res.json({status: false, msg: "User already exists"});
        }

        const hash = await bcrypt.hash(req.body.password, saltRounds);
        const user = await UserHash.create({user: req.body.username, hash: hash});

        return res.json({ status: true });
    } catch(ex) {
        next(ex);
    }
}

export async function login(req, res, next) {
    try {
        console.log(req);

        const user = await UserHash.findOne({ where: {user: req.body.username }});
        if (!user) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        const matched = await bcrypt.compare(req.body.password, user.hash);
        if (!matched) {
            return res.json({status: false, msg: "Incorrect username or password"});
        }

        return res.json({status: true });
    } catch(ex) {
        next(ex);
    }
}
