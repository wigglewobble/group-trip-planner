const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const buildPrompt = (tripDetails, aggregatedPrefs) => {
  return `You are a trip planning assistant. Generate a detailed itinerary based on the following information.

TRIP DETAILS:
- Destination: ${tripDetails.destination}
- Start date: ${tripDetails.startDate}
- End date: ${tripDetails.endDate}
- Number of travelers: ${aggregatedPrefs.groupSize}

GROUP PREFERENCES:
- Budget per person: ₹${aggregatedPrefs.budgetPerPerson} (this is the STRICT MAXIMUM - do not exceed this)
- Budget range across group: ₹${Math.min(...aggregatedPrefs.rawBudgets)} to ₹${Math.max(...aggregatedPrefs.rawBudgets)}
- Core interests (prioritize these): ${aggregatedPrefs.coreInterests.join(', ')}
- Bonus interests (include if budget allows): ${aggregatedPrefs.bonusInterests.join(', ') || 'none'}
- Energy level: ${aggregatedPrefs.energyLevel}
- Travel style: ${aggregatedPrefs.travelStyle} (relaxed = 1-2 activities/day, balanced = 3-4, packed = 5+)

INSTRUCTIONS:
1. Create a day-by-day itinerary covering the full trip duration.
2. Each day should have a theme and a list of activities with realistic times.
3. Match the travel style for number of activities per day.
4. Stay within the budget per person for the ENTIRE trip (all activities + estimated hotel costs combined).
5. Suggest hotel TYPES and AREAS, not specific hotel names (e.g. "3-star hotel near Calangute Beach" not a real hotel name).
6. For each activity, estimate a realistic cost in INR for one person.
7. Respond with ONLY valid JSON, no markdown formatting, no code blocks, no explanation text before or after.

Respond in exactly this JSON structure:
{
  "destination": "string",
  "totalDays": number,
  "summary": "string - 2-3 sentence overview of the trip",
  "days": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "theme": "string",
      "activities": [
        {
          "time": "HH:MM",
          "title": "string",
          "description": "string",
          "location": "string",
          "estimatedCost": number,
          "category": "string - one of: beaches, mountains, food, nightlife, museums, shopping, nature, adventure, relaxation, photography, logistics"
        }
      ]
    }
  ],
  "hotelSuggestions": [
    {
      "name": "string - hotel type description",
      "area": "string",
      "estimatedCostPerNight": number,
      "reason": "string"
    }
  ],
  "totalEstimatedCost": number
}`
}

const generateItinerary = async (tripDetails, aggregatedPrefs) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = buildPrompt(tripDetails, aggregatedPrefs)

  const result = await model.generateContent(prompt)
  const responseText = result.response.text()

  const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    const itinerary = JSON.parse(cleaned)
    return itinerary
  } catch (err) {
    throw new Error('AI returned invalid JSON: ' + err.message)
  }
}

module.exports = { generateItinerary, buildPrompt }