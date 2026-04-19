const express = require('express')
const http = require('http')
const path = require('path')
const connectDB = require('./DBconnection')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { initSocket } = require('./socket')
const { getAllowedOrigins, isOriginAllowed } = require('./utils/requestOrigins')

dotenv.config({ path: path.join(__dirname, '.env') })

// routes import
const userRoute = require('./routes/userRoutes')
const chefAuthRoutes = require('./routes/chefAuthRoutes')
const deliveryRoutes = require('./routes/deliveryRoutes')
const adminRoutes = require('./routes/adminRoutes')
const irctcRoutes = require('./routes/irctcRoutes')
const superAdminRoutes = require('./routes/superAdminRoutes')

// Instance of Express
const app = express()
const server = http.createServer(app)
const allowedOrigins = getAllowedOrigins()

// Middlewares
app.set('trust proxy', 1)
app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin, allowedOrigins)) {
        callback(null, true)
        return
      }

      callback(new Error('CORS origin not allowed'))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Home Meal Express backend is running.',
    environment: process.env.NODE_ENV || 'development',
  })
})

// User
app.use('/api/login', userRoute)

// Chef
app.use('/api/chef', chefAuthRoutes)

// Delivery
app.use('/api/delivery', deliveryRoutes)

// Admin
app.use('/api/admin', adminRoutes)

// IRCTC
app.use('/api/irctc', irctcRoutes)

// Superadmin
app.use('/api/superadmin', superAdminRoutes)

// Connection of DB and Port Listening
connectDB()
initSocket(server, allowedOrigins)
const Port = process.env.PORT || 5000
server.listen(Port, () => {
  console.log('Server is running on port ' + Port)
})
