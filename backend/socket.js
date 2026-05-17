const { Server } = require('socket.io')

let io = null

function initSocket(server, origins) {
  io = new Server(server, {
    cors: {
      origin: origins,
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

    socket.on('join-delivery-room', (deliveryId) => {
      if (!deliveryId) return
      socket.join(`delivery-room:${deliveryId}`)
      console.log(`Delivery connected to Socket.IO: ${deliveryId} (${socket.id})`)
    })

    socket.on('join-user-room', (userId) => {
      if (!userId) return
      socket.join(`user-room:${userId}`)
      console.log(`User connected to Socket.IO: ${userId} (${socket.id})`)
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

function emitToDelivery(deliveryId, eventName, payload) {
  if (!io || !deliveryId) return
  console.log(`Socket event emitted to delivery ${deliveryId}: ${eventName} (${payload?.id || 'no-id'})`)
  io.to(`delivery-room:${deliveryId}`).emit(eventName, payload)
}

function emitToUser(userId, eventName, payload) {
  if (!io || !userId) return
  console.log(`Socket event emitted to user ${userId}: ${eventName} (${payload?.orderId || payload?.id || 'no-id'})`)
  io.to(`user-room:${userId}`).emit(eventName, payload)
}

module.exports = {
  initSocket,
  emitToAdmins,
  emitToChef,
  emitToDelivery,
  emitToUser,
}
