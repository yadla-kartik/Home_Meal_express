const express = require('express')
const path = require('path')
const connectDB = require('./DBconnection')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')

dotenv.config()

// routes import
const userRoute = require('./routes/userRoutes')
const chefAuthRoutes = require('./routes/chefAuthRoutes')
const deliveryRoutes = require('./routes/deliveryRoutes')

// Instance of Express
const app = express()

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
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

// Connection of DB and Port Listening
connectDB()
const Port = process.env.PORT || 5000
app.listen(Port, () => {
  console.log('Server is running on port ' + Port)
})
