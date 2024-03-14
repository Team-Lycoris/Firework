import FriendInvite from "../database/friendInvite.js";
import Group from "../database/group.js";
import User from "../database/user.js";

export default function userHandler(io, socket, connectedSockets) {
    function handleDisconnect(reason) {
        console.log('Client disconnected:', reason);
        connectedSockets.delete(socket.userId);
    }

    async function handleSendMessage(data) {
        try {
            const group = await Group.findOne({ where: { id: data.groupId }});
            if (!group) {
                //callback({status: false, msg: "Group does not exist"});
                return;
            }
            const recipients = await group.getUsers();

            // a bit of a hack to include author and group name in data for notifications
            data.groupName = group.name;
            data.isDm = group.isDm;
            data.authorName = (await User.findOne({ where: {id: data.message.author}})).username;

            recipients.forEach((recipient) => {
                const recipientSocket = connectedSockets.get(recipient.id);
                if (recipientSocket) {
                    socket.to(recipientSocket).emit('receive-message', data);
                }
            });

            //callback({status: true});
        } catch(ex) {
            console.error(ex);
            //callback({status: false, msg: ex});
        }
    }

    async function handleAddToGroup(data) {
        try {
            // Check if the group exists
            const group = await Group.findOne({ where: { id: data.group.id }});
            if (group === null) {
                console.error("Group does not exist");
                return;
            }

            // Check if invitee exists
            const invitee = await User.findOne({ where: {id: data.invitee.id }});
            if (invitee === null) {
                console.error("Invitee does not exists")
                return;
            }

            // Check if the invitee is connected to a socket
            const inviteeSocket = connectedSockets.get(invitee.id);
            if (inviteeSocket) {
                socket.to(inviteeSocket).emit('receive-group', data);
            }
        } catch(ex) {
            console.error(ex);
        }
    }

    async function handleSendFriendInvite(data) {
        try {
            // Check if inviter exists
            const inviter = await User.findOne({ where: {id: data.inviter.id }});
            if (inviter === null) {
                console.error("Inviter does not exists")
                return;
            }

            // Check if invitee exists
            const invitee = await User.findOne({ where: {id: data.invitee.id }});
            if (invitee === null) {
                console.error("Invitee does not exists")
                return;
            }

            // Check if friend invite exists
            const invite = await FriendInvite.findOne({ where: {inviter: inviter.id, invitee: invitee.id}});
            if (invite === null) {
                console.error("Invite does not exist");
                return;
            }

            // Check if the invitee is connected to a socket
            const inviteeSocket = connectedSockets.get(invitee.id);
            if (inviteeSocket) {
                socket.to(inviteeSocket).emit('receive-invite', data);
            }
        } catch(ex) {
            console.error(ex);
        }
    }

    function handleAcceptFriendInvite(data) {

    }

    socket.on('disconnect', handleDisconnect);
    socket.on('send-message', handleSendMessage);
    socket.on('add-to-group', handleAddToGroup);
    socket.on('send-friend-invite', handleSendFriendInvite);
    //socket.on('accept-friend-invite', handleAcceptFriendInvite);
}
