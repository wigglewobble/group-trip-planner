const express = require('express')
const router = express.Router()
const prisma = require('../db')
const { requireAuth } = require('../middleware/auth')

router.post('/sync', requireAuth, async (req, res) => {
    
    const { id, email, name } = req.body

    if (req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden' })
    }

    try {
        const user = await prisma.user.upsert({
            where: { id },
            update: { email, name },
            create: { id, email, name }
        })

        res.json({ user })
    } catch (err) {
        console.error('User sync error:', err)
        res.status(500).json({ error: 'Failed to sync user' })
    }
})

router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({ user })
    } catch (err) {
        console.error('Get user error:', err)
        res.status(500).json({ error: 'Failed to get user' })
    }
})

module.exports = router