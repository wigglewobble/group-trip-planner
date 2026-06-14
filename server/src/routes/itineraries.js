const express = require('express')
const router = express.Router({ mergeParams: true })
const prisma = require('../db')
const { requireAuth } = require('../middleware/auth')
const { aggregatePreferences } = require('../services/aggregator')
const { generateTripItinerary } = require('../services/ai')

router.post('/generate', requireAuth, async (req, res) => {
  const { tripId } = req.params

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: {
          where: { status: 'ACCEPTED' }
        }
      }
    })

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    const isMember = trip.members.some(m => m.userId === req.user.id)
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this trip' })
    }

    const allSubmitted = trip.members.length > 0 &&
      trip.members.every(m => m.hasSubmitted)

    if (!allSubmitted) {
      return res.status(400).json({ error: 'All members must submit preferences first' })
    }

    const aggregatedPrefs = aggregatePreferences(trip.members)

    const tripDetails = {
      destination: trip.destination,
      startDate: trip.startDate.toISOString().split('T')[0],
      endDate: trip.endDate.toISOString().split('T')[0],
    }

    const { itinerary, provider } = await generateTripItinerary(tripDetails, aggregatedPrefs)

    await prisma.itinerary.updateMany({
      where: { tripId },
      data: { isActive: false }
    })

    const savedItinerary = await prisma.itinerary.create({
      data: {
        tripId,
        data: itinerary,
        version: 1,
        isActive: true
      }
    })

    await prisma.trip.update({
      where: { id: tripId },
      data: { status: 'READY' }
    })

    res.status(201).json({ itinerary: savedItinerary, provider })
  } catch (err) {
    console.error('Generate itinerary error:', err)
    res.status(500).json({ error: err.message || 'Failed to generate itinerary' })
  }
})

router.get('/active', requireAuth, async (req, res) => {
  const { tripId } = req.params

  try {
    const itinerary = await prisma.itinerary.findFirst({
      where: { tripId, isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    if (!itinerary) {
      return res.status(404).json({ error: 'No active itinerary found' })
    }

    res.json({ itinerary })
  } catch (err) {
    console.error('Get itinerary error:', err)
    res.status(500).json({ error: 'Failed to get itinerary' })
  }
})

module.exports = router