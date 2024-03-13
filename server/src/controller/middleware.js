import FireworkAuth from '../auth/fireworkAuth.js';

export async function authUser(req, res, next) {
    try {
        const token = req.header('Authorization').split(' ')[1];

        const decoded = await FireworkAuth.prototype.verifyJWT(token);

        console.log('API token:', decoded);
        
        req.userId = decoded.userId;

        next();
    } catch(ex) {
        console.error(ex);
        return res.json({status: false, msg: "Authentication failed"});
    }
}

export async function socketAuth(socket, next) {
    try {
        const token = socket.handshake.auth.token;

        const decoded = await FireworkAuth.prototype.verifyJWT(token);

        console.log('Socket token:', decoded);
        
        socket.userId = decoded.userId;

        next();
    } catch(ex) {
        console.error(ex);
        next(ex);
    }
}