export async function test(req, res, next) {
    try {
        console.log(req.body.message);
        return res.json({status: true});
    } catch(ex) {
        next(ex);
    }
}