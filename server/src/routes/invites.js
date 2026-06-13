const express = require('express')
const router = express.Router()
const prisma = require('../db')
const { requireAuth } = require('../middleware/auth')

router.get('/', requireAuth, async (req, res) => {
  try {
    const invites = await prisma.tripMember.findMany({
      where: {
        userId: req.user.id,
        status: 'INVITED'
      },
      include: {
        trip: true
      }
    })

    res.json({ invites })
  } catch (err) {
    console.error('Get invites error:', err)
    res.status(500).json({ error: 'Failed to get invites' })
  }
})

router.patch('/:tripId/respond', requireAuth, async (req, res) => {
  const { tripId } = req.params
  const { accept } = req.body
  const userId = req.user.id

  if (typeof accept !== 'boolean') {
    return res.status(400).json({ error: 'accept must be true or false' })
  }

  try {
    if (accept) {
      const member = await prisma.tripMember.update({
        where: {
          tripId_userId: { tripId, userId }
        },
        data: { status: 'ACCEPTED' },
        include: { user: true, trip: true }
      })
      return res.json({ member })
    } else {
      await prisma.tripMember.delete({
        where: {
          tripId_userId: { tripId, userId }
        }
      })
      return res.json({ message: 'Invite declined' })
    }
  } catch (err) {
    console.error('Respond to invite error:', err)
    res.status(500).json({ error: 'Failed to respond to invite' })
  }
})

module.exports = router