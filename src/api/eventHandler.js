export default function eventHandler(io, socket) {
  function handleMessage(data, callback) {
    console.log(data);
    callback({
      status: "OK"
    })
  }

  socket.on("message", handleMessage);
}