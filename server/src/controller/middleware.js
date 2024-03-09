import FireworkAuth from '../auth/fireworkAuth.js';

export async function authUser(req, res, next) {
    try {
        const token = req.header('Authorization').split(' ')[1];

        const decoded = await FireworkAuth.prototype.verifyJWT(token);

        console.log(decoded);
        
        req.user = decoded.user;

        next();
    } catch(ex) {
        console.error(ex);
        return res.json({status: false, msg: "Authentication failed"});
    }
}