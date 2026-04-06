import { io } from 'socket.io-client'

let adminSocket = null

export const getAdminSocket = () => {
  if (!adminSocket) {
    adminSocket = io('http://localhost:5000', {
      withCredentials: true,
      autoConnect: false,
    })
  }

  return adminSocket
}
