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

export async function addUserToGroup(req, res, next) {
    try {
        console.log(req.body);
        const group = await Group.findOne({ where: { id: req.body.groupId }});
        if (group === null) {
            return res.json({status: false, msg: "Group does not exist"});
        }
        const inviter = await Group.findOne({ where: { id: req.userId }});
        if (inviter === null) {
            return res.json({status: false, msg: "User does not exist"});
        }
        const invitee = await Group.findOne({ where: { id: req.body.inviteeId }});
        if (invitee === null) {
            return res.json({status: false, msg: "User does not exist"});
        }
        if (await group.hasUser(inviter)) {
            group.addUser(invitee);
        }

        return res.json({status: true, group: group.toJSON()});
    } catch(ex) {
        next(ex);
    }
}

export async function getSelfInfo(req, res, next) {
    try {
        const user = await User.findOne({ where: { id: req.userId }});
        if (user === null) {
            return res.json({status: false, msg: "User does not exist"});
        }

        const data = user.toJSON();

        return res.json({status:true, userInfo: data});
    } catch(ex) {
        next(ex);
    }
}

export async function createDM(req, res, next) {
    try {
        const sender = await User.findOne({ where: { id: req.userId }});
        const receiver = await User.findOne({ where: { id: req.body.otherUser }});

        const dm = await Group.create({name: null, isDm: true});
        await dm.addUsers([sender, receiver]);

        console.log(dm);
        console.log(await dm.getUsers());

        return res.json({status: true, dmId: dm.id});
    } catch(ex) {
        next(ex);
    }
}

export async function createGroup(req, res, next) {
    try {
        const user = await User.findOne({ where: { id: req.userId }});
        if (user === null) {
            return res.json({status: false, msg: "User does not exist"});
        }

        const group = await Group.create({ name: req.body.groupName });
        await group.addUser(user);

        await Promise.all(req.body.userIds.map(async (id) => {
            const additionalUser = await User.findOne({ where: { id: id }});
            await group.addUser(additionalUser);
        }));

        console.log(group);

        return res.json({ status: true, group: group.toJSON() });
    } catch(ex) {
        next(ex);
    }
}

export async function getGroups(req, res, next) {
    try {
        const user = await User.findOne({ where: { id: req.userId }});
        if (user === null) {
            return res.json({status: false, msg: "User does not exist"});
        }

        const query = await user.getGroups();

        const groups = query.map(grp => grp.toJSON());

        return res.json({status: true, groups: groups});
    } catch(ex) {
        next(ex);
    }
}

export async function getMessages(req, res, next) {
    try {
        const group = await Group.findOne({ where: { id: req.params.groupId }});
        if (group === null) {
            return res.json({status: false, msg: "Group does not exist"});
        }

        const query = await group.getMessages();

        const messages = query.map(msg => msg.toJSON());

        return res.json({status: true, messages: messages});
    } catch(ex) {
        next(ex);
    }
}

export async function sendMessage(req, res, next) {
    try {
        const content = req.body.message;
        const sender = await User.findOne({ where: { id: req.userId }});
        if (sender === null) {
            return res.json({status: false, msg: "Sender does not exist"});
        }
        const group = await Group.findOne({ where: { id: req.params.groupId }});
        if (group === null) {
            return res.json({status: false, msg: "Group does not exist"});
        }
        sender.sendMessage(content, group.id);
        return res.json({status: true});
    } catch(ex) {
        next(ex);
    }
}
