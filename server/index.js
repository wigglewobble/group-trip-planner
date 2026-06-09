require('dotenv').config()
const express = require('express')
const cors = require('cors')
const prisma = require('./src/db')


const app = express()

app.use(cors())
app.use(express.json())

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