import { io } from 'socket.io-client'

let adminSocket = null
let chefSocket = null
const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const getAdminSocket = () => {
  if (!adminSocket) {
    adminSocket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
    })
  }

  return adminSocket
}

export const getChefSocket = () => {
  if (!chefSocket) {
    chefSocket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
    })
  }

  return chefSocket
}
