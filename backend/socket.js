const { Server } = require('socket.io')

let io = null

function initSocket(server, origin) {
  io = new Server(server, {
    cors: {
      origin,
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log('Admin connected to Socket.IO', socket.id)
    socket.on('join-admin-room', () => {
      socket.join('admin-room')
    })
  })

  return io
}

function getIO() {
  return io
}

function emitToAdmins(eventName, payload) {
  if (!io) return
  io.to('admin-room').emit(eventName, payload)
}

module.exports = {
  initSocket,
  getIO,
  emitToAdmins,
}
