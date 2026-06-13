const express = require('express')
const router = express.Router()
const prisma = require('../db')
const { requireAuth } = require('../middleware/auth')

router.post('/', requireAuth, async (req, res) => {
    const { name, destination, startDate, endDate } = req.body

    if (!name || !destination || !startDate || !endDate) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    try {

        console.log("===============");
        console.log("req.user =", req.user);
        console.log("req.user.id =", req.user.id);

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        console.log("User found in DB =", user);
        console.log("===============");

        const trip = await prisma.trip.create({
            data: {
                name,
                destination,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                adminId: req.user.id,
                members: {
                    create: {
                        userId: req.user.id,
                        status: 'ACCEPTED'
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        })

        res.status(201).json({ trip });

    } catch (err) {
        console.error('Create trip error:', err)
        res.status(500).json({ error: 'Failed to create trip' })
    }

})

router.get('/my', requireAuth, async (req, res) => {
    try {
        const trips = await prisma.trip.findMany({
            where: {
                members: {
                    some: {
                        userId: req.user.id,
                        status: 'ACCEPTED'
                    }
                }
            },
            include: {
                members: {
                    where: { status: 'ACCEPTED' },
                    include: { user: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        res.json({ trips })
    } catch (err) {
        console.error('Get trips error:', err)
        res.status(500).json({ error: 'Failed to get trips' })
    }
})
router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params

    try {
        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                members: {
                    include: { user: true }
                }
            }
        })

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' })
        }

        const isMember = trip.members.some(
            m => m.userId === req.user.id && m.status === 'ACCEPTED'
        )
        if (!isMember) {
            return res.status(403).json({ error: 'You are not a member of this trip' })
        }

        res.json({ trip })
    } catch (err) {
        console.error('Get trip error:', err)
        res.status(500).json({ error: 'Failed to get trip' })
    }
})

router.delete('/:id', requireAuth, async (req, res) => {
    const { id } = req.params
    try {
        const trip = await prisma.trip.findUnique({ where: { id } })
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' })
        }
        if (trip.adminId !== req.user.id) {
            return res.status(403).json({ error: 'Only the trip admin can delete this trip' })
        }
        await prisma.trip.delete({ where: { id } })
        res.json({ message: 'Trip deleted' })
    } catch (err) {
        console.error('Delete trip error:', err)
        res.status(500).json({ error: 'Failed to delete trip' })
    }
})
module.exports = router