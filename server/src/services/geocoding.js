const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const geocodeAddress = async (address, destination) => {
  const query = `${address}, ${destination}`
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'TripSync/1.0 (group trip planner app)'
    }
  })

  const data = await res.json()

  if (!data || data.length === 0) {
    return null
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  }
}

const geocodeItinerary = async (itinerary, destination) => {
  for (const day of itinerary.days || []) {
    for (const activity of day.activities || []) {
      if (activity.category === 'logistics') {
        continue
      }

      try {
        const coords = await geocodeAddress(activity.location, destination)
        if (coords) {
          activity.coordinates = coords
        }
        await sleep(1100)
      } catch (err) {
        console.error(`Geocoding failed for "${activity.location}":`, err.message)
      }
    }
  }

  return itinerary
}

module.exports = { geocodeItinerary }