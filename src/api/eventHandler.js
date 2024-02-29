export default function eventHandler(io, socket) {
  function handleDisconnect(reason) {
    console.log('Client disconnected:', reason);
  }
  
  function handleMessage(data, callback) {
    console.log("Message:", data);
    callback({
      status: 'OK'
    });
  }

  function handleCreateChannel(data, callback) {
    console.log("Create channel:", data);
    callback({
      status: 'OK'
    });
  }

  function handleDeleteChannel(data, callback) {
    console.log("Delete channel:", data);
    callback({
      status: 'OK'
    });
  }

  function handleJoinChannel(data, callback) {
    console.log("Join channel:", data);
    callback({
      status: 'OK'
    });
  }

  function handleLeaveChannel(data, callback) {
    console.log("Leave channel:", data);
    callback({
      status: 'OK'
    });
  }

  function handleInviteToChannel(data, callback) {
    console.log("Invite to channel:", data);
    callback({
      status: 'OK'
    });
  }
  
  socket.on('disconnect', handleDisconnect);
  socket.on('user:message', handleMessage);
  socket.on('user:create-channel', handleCreateChannel);
  socket.on('user:delete-channel', handleDeleteChannel);
  socket.on('user:join-channel', handleJoinChannel);
  socket.on('user:leave-channel', handleLeaveChannel);
  socket.on('user:invite-to-channel', handleInviteToChannel);
}