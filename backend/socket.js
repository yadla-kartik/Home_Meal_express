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
    socket.on('join-admin-room', () => {
      socket.join('admin-room')
      console.log(`Admin connected to Socket.IO: ${socket.id}`)
    })

    socket.on('join-chef-room', (chefId) => {
      if (!chefId) return
      socket.join(`chef-room:${chefId}`)
      console.log(`Chef connected to Socket.IO: ${chefId} (${socket.id})`)
    })

    socket.on('disconnect', () => {
      console.log(`Socket.IO client disconnected: ${socket.id}`)
    })
  })

  return io
}

function emitToAdmins(eventName, payload) {
  if (!io) return
  console.log(`Socket event emitted to admins: ${eventName} (${payload?.id || 'no-id'})`)
  io.to('admin-room').emit(eventName, payload)
}

function emitToChef(chefId, eventName, payload) {
  if (!io || !chefId) return
  console.log(`Socket event emitted to chef ${chefId}: ${eventName} (${payload?.id || 'no-id'})`)
  io.to(`chef-room:${chefId}`).emit(eventName, payload)
}

module.exports = {
  initSocket,
  emitToAdmins,
  emitToChef,
}
