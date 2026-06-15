const KNOWN_LOCATIONS = {
  'goa': { latitude: 15.2993, longitude: 74.1240, resolvedName: 'Goa, India' },
  'mumbai': { latitude: 19.0760, longitude: 72.8777, resolvedName: 'Mumbai, India' },
  'delhi': { latitude: 28.7041, longitude: 77.1025, resolvedName: 'Delhi, India' },
  'manali': { latitude: 32.2432, longitude: 77.1892, resolvedName: 'Manali, India' },
  'shimla': { latitude: 31.1048, longitude: 77.1734, resolvedName: 'Shimla, India' },
  'jaipur': { latitude: 26.9124, longitude: 75.7873, resolvedName: 'Jaipur, India' },
  'kerala': { latitude: 10.8505, longitude: 76.2711, resolvedName: 'Kerala, India' },
  'kochi': { latitude: 9.9312, longitude: 76.2673, resolvedName: 'Kochi, India' },
  'darjeeling': { latitude: 27.0410, longitude: 88.2663, resolvedName: 'Darjeeling, India' },
  'rishikesh': { latitude: 30.0869, longitude: 78.2676, resolvedName: 'Rishikesh, India' },
  'udaipur': { latitude: 24.5854, longitude: 73.7125, resolvedName: 'Udaipur, India' },
  'gangtok': { latitude: 27.3389, longitude: 88.6065, resolvedName: 'Gangtok, India' },
  'shillong': { latitude: 25.5788, longitude: 91.8933, resolvedName: 'Shillong, India' },
  'srinagar': { latitude: 34.0837, longitude: 74.7973, resolvedName: 'Srinagar, India' },
}

const geocodeLocation = async (destination) => {
  const cleanName = destination.split(',')[0].trim().toLowerCase()

  if (KNOWN_LOCATIONS[cleanName]) {
    return KNOWN_LOCATIONS[cleanName]
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=10&language=en&format=json`

  const res = await fetch(url)
  const data = await res.json()

  if (!data.results || data.results.length === 0) {
    throw new Error(`Could not find location: ${destination}`)
  }

  let candidates = data.results

  if (destination.toLowerCase().includes('india')) {
    const indiaResults = candidates.filter(r => r.country_code === 'IN')
    if (indiaResults.length > 0) {
      candidates = indiaResults
    }
  }

  candidates.sort((a, b) => (b.population || 0) - (a.population || 0))

  const { latitude, longitude, name, country } = candidates[0]
  return { latitude, longitude, resolvedName: `${name}, ${country}` }
}

const getWeatherForecast = async (destination, startDate, endDate) => {
    const { latitude, longitude, resolvedName } = await geocodeLocation(destination)

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&start_date=${startDate}&end_date=${endDate}`

    const res = await fetch(url)
    const data = await res.json()

    if (!data.daily) {
        throw new Error('Weather forecast unavailable for this date range')
    }

    const forecast = data.daily.time.map((date, idx) => ({
        date,
        precipitationProbability: data.daily.precipitation_probability_max[idx],
        tempMax: data.daily.temperature_2m_max[idx],
        tempMin: data.daily.temperature_2m_min[idx],
        weatherCode: data.daily.weathercode[idx],
    }))

    return { resolvedName, forecast }
}

module.exports = { getWeatherForecast }