import FriendInvite from "../database/friendInvite.js";
import Group from "../database/group.js";
import User from "../database/user.js";
import Event from "../database/event.js";

export async function test(req, res, next) {
    try {
        console.log(req.body.message);
        return res.json({status: true});
    } catch(ex) {
        next(ex);
    }
}

export async function getIncomingFriendInvites(req, res, next) {
    try {
        const user = await User.findOne({ where: { id: req.userId }});
        if (user === null) {
            return res.json({status: false, msg: "User does not exist"});
        }
        const query = await FriendInvite.findAll({ where: { invitee: user.id}});

        const invites = query.map(q => q.toJSON());

        return res.json({status:true, invites: invites});
    } catch(ex) {
        next(ex);
    }
}

export async function getOutgoingFriendInvites(req, res, next) {
    try {
        const user = await User.findOne({ where: { id: req.userId }});
        if (user === null) {
            return res.json({status: false, msg: "User does not exist"});
        }
        const query = await FriendInvite.findAll({ where: { inviter: user.id}});

        const invites = query.map(q => q.toJSON());

        return res.json({status:true, invites: invites});
    } catch(ex) {
        next(ex);
    }
}

export async function sendFriendInvite(req, res, next) {
    try {
        const inviter = await User.findOne({ where: { id: req.userId }});
        if (inviter === null) {
            return res.json({status: false, msg: "Inviter does not exist"});
        }
        const invitee = await User.findOne({ where: { username: req.body.inviteeUsername }});
        if (invitee === null) {
            return res.json({status: false, msg: "User does not exist"});
        }
        const existsOutgoing = await FriendInvite.findOne({ where: {inviter: inviter.id, invitee: invitee.id}});
        if (existsOutgoing) {
            return res.json({status: false, msg: "You have already sent an invite to this user"});
        }
        const existsIncoming = await FriendInvite.findOne({ where: {inviter: invitee.id, invitee: inviter.id}});
        if (existsIncoming) {
            return res.json({status: false, msg: "You already have an invite from this user"});
        }
        const invite = await FriendInvite.create({ inviter: inviter.id, invitee: invitee.id,
                                                   inviterName: inviter.username, inviteeName: invitee.username });

        return res.json({
            status: true,
            invite: invite.toJSON(),
            inviter: inviter.toJSON(),
            invitee: invitee.toJSON()
        });
    } catch(ex) {
        next(ex);
    }
}

export async function acceptFriendInvite(req, res, next) {
    try {
        const invite = await FriendInvite.findOne({ where: { invitee: req.userId, inviter: req.body.inviterId }});
        if (invite === null) {
            return res.json({status: false, msg: "Invite not found"});
        }
        const group = await invite.startFriendship();
        return res.json({status: true, group: group.toJSON()});
    } catch(ex) {
        next(ex);
    }
}

export async function declineFriendInvite(req, res, next) {
    try {
        const invite = await FriendInvite.findOne({ where: { invitee: req.userId, inviter: req.body.inviterId } });
        if (invite === null) {
            return res.json({status: false, msg: "Invite not found"});
        }
        await invite.destroy();
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
        const inviter = await User.findOne({ where: { id: req.userId }});
        if (inviter === null) {
            return res.json({status: false, msg: "User does not exist"});
        }
        const invitee = await User.findOne({ where: { username: req.body.inviteeUsername }});
        if (invitee === null) {
            return res.json({status: false, msg: "User does not exist"});
        }
        const inviterInGroup = await group.hasUser(inviter);
        if (!inviterInGroup) {
            return res.json({status: false, msg: "You are not in this group"});
        }
        const inviteeInGroup = await group.hasUser(invitee);
        if (inviteeInGroup) {
            return res.json({status: false, msg: "The user is already in this group"});
        }

        group.addUser(invitee);

        return res.json({status: true, group: group.toJSON(), invitee: invitee.toJSON()});
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

        const dm = await Group.create({name: sender.username + " " + receiver.username, isDm: true});
        await dm.addUsers([sender, receiver]);

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

        const message = await sender.sendMessage(content, group.id, req.body.latitude, req.body.longitude);

        return res.json({status: true, message: message});
    } catch(ex) {
        next(ex);
    }
}
