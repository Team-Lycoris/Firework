export default function eventHandler(io, socket) {
  function handleMessage(data, callback) {
    console.log(data);
    callback({
      status: "OK"
    })
  }

  function handleDisconnect(reason) {
    console.log('Client disconnected:', reason);
  }

  socket.on('message', handleMessage);
  socket.on('disconnect', handleDisconnect);
}