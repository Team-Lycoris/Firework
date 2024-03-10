import Group from "../database/group.js";
import User from "../database/user.js";

export async function test(req, res, next) {
    try {
        console.log(req.body.message);
        return res.json({status: true});
    } catch(ex) {
        next(ex);
    }
}

export async function getGroups(req, res, next) {
    try {
        const user = await User.findOne({ where: {id: req.userId} });
        /*
        const user2 = await User.findOne({ where: {id: 1}});
        const group = await Group.create({ name: 'test' });
        await user.addGroup(group);
        await user2.addGroup(group);
        */
        const query = await user.getGroups();

        const groups = query.map(grp => grp.toJSON());

        return res.json({status: true, groups: groups});
    } catch(ex) {
        next(ex);
    }
}
