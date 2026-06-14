const Groq = require('groq-sdk')
const { buildPrompt } = require('./gemini')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const generateItineraryGroq = async (tripDetails, aggregatedPrefs) => {
  const prompt = buildPrompt(tripDetails, aggregatedPrefs)

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  })

  const responseText = completion.choices[0]?.message?.content || ''
  const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    const itinerary = JSON.parse(cleaned)
    return itinerary
  } catch (err) {
    throw new Error('Groq returned invalid JSON: ' + err.message)
  }
}

module.exports = { generateItineraryGroq }