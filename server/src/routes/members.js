const express = require('express')
const router = express.Router({ mergeParams: true })
const prisma = require('../db')
const { requireAuth } = require('../middleware/auth')

router.post('/invite', requireAuth, async (req, res) => {
    const { tripId } = req.params
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    }

    try {
        const trip = await prisma.trip.findUnique({ where: { id: tripId } })

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' })
        }

        if (trip.adminId !== req.user.id) {
            return res.status(403).json({ error: 'Only the trip admin can invite members' })
        }

        const userToInvite = await prisma.user.findUnique({
            where: { email }
        })

        if (!userToInvite) {
            return res.status(404).json({ error: 'No user found with that email' })
        }

        const existingMember = await prisma.tripMember.findUnique({
            where: {
                tripId_userId: {
                    tripId,
                    userId: userToInvite.id
                }
            }
        })

        if (existingMember) {
            return res.status(400).json({ error: 'User is already a member of this trip' })
        }

        const member = await prisma.tripMember.create({
            data: {
                tripId,
                userId: userToInvite.id,
                status: 'INVITED'
            },
            include: {
                user: true
            }
        })

        res.status(201).json({ member })
    } catch (err) {
        console.error('Invite member error:', err)
        res.status(500).json({ error: 'Failed to invite member' })
    }
})

router.delete('/:userId', requireAuth, async (req, res) => {
    const { tripId, userId } = req.params

    try {
        const trip = await prisma.trip.findUnique({ where: { id: tripId } })

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' })
        }

        const isAdmin = trip.adminId === req.user.id
        const isSelf = userId === req.user.id

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ error: 'Not allowed' })
        }

        if (isAdmin && userId === req.user.id) {
            return res.status(400).json({ error: 'Admin cannot leave the trip' })
        }

        await prisma.tripMember.delete({
            where: {
                tripId_userId: {
                    tripId,
                    userId
                }
            }
        })

        res.json({ message: 'Member removed' })
    } catch (err) {
        console.error('Remove member error:', err)
        res.status(500).json({ error: 'Failed to remove member' })
    }
})


module.exports = router