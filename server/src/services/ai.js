const { generateItinerary } = require('./gemini')
const { generateItineraryGroq } = require('./groq')

const generateTripItinerary = async (tripDetails, aggregatedPrefs) => {
  try {
    const itinerary = await generateItinerary(tripDetails, aggregatedPrefs)
    return { itinerary, provider: 'gemini' }
  } catch (geminiErr) {
    console.error('Gemini failed, falling back to Groq:', geminiErr.message)

    try {
      const itinerary = await generateItineraryGroq(tripDetails, aggregatedPrefs)
      return { itinerary, provider: 'groq' }
    } catch (groqErr) {
      console.error('Groq also failed:', groqErr.message)
      throw new Error('Both AI providers failed to generate an itinerary')
    }
  }
}

module.exports = { generateTripItinerary }