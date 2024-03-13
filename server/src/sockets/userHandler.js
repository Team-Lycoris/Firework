import Group from "../database/group.js";

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

            recipients.forEach((recipient) => {
                const recipientSocket = connectedSockets.get(recipient.id);
                if (recipientSocket) {
                    socket.to(recipientSocket).emit('receive-message', data.message);
                }
            });

            //callback({status: true});
        } catch(ex) {
            console.error(ex);
            //callback({status: false, msg: ex});
        }
    }

    function handleAddToGroup(data) {

    }

    function handleSendFriendInvite(data) {

    }

    function handleAcceptFriendInvite(data) {
        
    }

    socket.on('disconnect', handleDisconnect);
    socket.on('send-message', handleSendMessage);
    socket.on('add-to-group', handleAddToGroup);
    socket.on('send-friend-invite', handleSendFriendInvite);
    socket.on('accept-friend-invite', handleAcceptFriendInvite);
}
