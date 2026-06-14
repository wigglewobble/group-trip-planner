require('dotenv').config()
const express = require('express')
const cors = require('cors')
const prisma = require('./src/db')
const usersRouter=require('./src/routes/users')
const tripsRouter=require('./src/routes/trips')
const membersRouter=require('./src/routes/members')
const invitesRouter=require('./src/routes/invites')
const itinerariesRouter=require('./src/routes/itineraries')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/users',usersRouter)
app.use('/api/trips',tripsRouter)
app.use('/api/trips/:tripId/members',membersRouter)
app.use('/api/invites',invitesRouter)
app.use('/api/trips/:tripId/itinerary',itinerariesRouter)
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'Server and database are running' })
  } catch (err) {
    res.status(500).json({ status: 'Database connection failed', error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

