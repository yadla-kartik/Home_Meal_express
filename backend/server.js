const express = require('express')
const connectDB = require('./DBconnection')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')

dotenv.config()

// routes import
const userRoute = require('./routes/userRoutes')

// Instance of Express
const app = express()

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// User
app.use('/api/login', userRoute)

// Connection of DB and Port Listening
connectDB()
const Port = process.env.PORT || 5000
app.listen(Port, () => {
  console.log('Server is running on port ' + Port)
})
