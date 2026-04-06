const express = require('express')
const http = require('http')
const path = require('path')
const connectDB = require('./DBconnection')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { initSocket } = require('./socket')

dotenv.config()

// routes import
const userRoute = require('./routes/userRoutes')
const chefAuthRoutes = require('./routes/chefAuthRoutes')
const deliveryRoutes = require('./routes/deliveryRoutes')
const adminRoutes = require('./routes/adminRoutes')

// Instance of Express
const app = express()
const server = http.createServer(app)
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

// Middlewares
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
)
app.use(express.json({ limit: '15mb' }))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// User
app.use('/api/login', userRoute)

// Chef
app.use('/api/chef', chefAuthRoutes)

// Delivery
app.use('/api/delivery', deliveryRoutes)

// Admin
app.use('/api/admin', adminRoutes)

// Connection of DB and Port Listening
connectDB()
initSocket(server, clientOrigin)
const Port = process.env.PORT || 5000
server.listen(Port, () => {
  console.log('Server is running on port ' + Port)
})
