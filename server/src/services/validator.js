const KNOWN_CATEGORIES = [
  'beaches', 'mountains', 'food', 'nightlife', 'museums',
  'shopping', 'nature', 'adventure', 'relaxation', 'photography',
  'logistics', 'culture', 'other'
]
const validateItineraryStructure = (itinerary, tripDetails, aggregatedPrefs) => {
  const issues = []

  if (!itinerary.days || !Array.isArray(itinerary.days)) {
    issues.push({
      severity: 'critical',
      type: 'missing_days',
      message: 'Itinerary has no days array'
    })
    return { valid: false, issues }
  }

  const expectedDays = itinerary.totalDays
  if (itinerary.days.length !== expectedDays) {
    issues.push({
      severity: 'moderate',
      type: 'day_count_mismatch',
      message: `Expected ${expectedDays} days but got ${itinerary.days.length}`
    })
  }

  itinerary.days.forEach(day => {
    if (!day.activities || day.activities.length === 0) {
      issues.push({
        severity: 'moderate',
        type: 'empty_day',
        message: `Day ${day.day} has no activities`
      })
    }

    day.activities?.forEach(activity => {
      if (!KNOWN_CATEGORIES.includes(activity.category)) {
        issues.push({
          severity: 'minor',
          type: 'unknown_category',
          message: `Unknown category "${activity.category}" for activity "${activity.title}" - normalized to "other"`,
          fix: { activityTitle: activity.title, day: day.day }
        })
        activity.category = 'other'
      }
    })
  })

  const calculatedCost = itinerary.days.reduce((total, day) => {
    return total + (day.activities?.reduce((dayTotal, act) => dayTotal + (act.estimatedCost || 0), 0) || 0)
  }, 0)

  const hotelCost = (itinerary.hotelSuggestions?.[0]?.estimatedCostPerNight || 0) * (itinerary.totalDays - 1)
  const fullCalculatedCost = calculatedCost + hotelCost

  const costDifference = Math.abs(fullCalculatedCost - itinerary.totalEstimatedCost)
  const costDifferencePercent = (costDifference / itinerary.totalEstimatedCost) * 100

  if (costDifferencePercent > 15) {
    issues.push({
      severity: 'minor',
      type: 'cost_mismatch',
      message: `Stated total (₹${itinerary.totalEstimatedCost}) differs from calculated total (₹${fullCalculatedCost}) by ${costDifferencePercent.toFixed(0)}%`
    })
  }

  if (itinerary.totalEstimatedCost > aggregatedPrefs.budgetPerPerson) {
    const overBy = itinerary.totalEstimatedCost - aggregatedPrefs.budgetPerPerson
    const overByPercent = (overBy / aggregatedPrefs.budgetPerPerson) * 100

    issues.push({
      severity: overByPercent > 20 ? 'critical' : 'moderate',
      type: 'budget_exceeded',
      message: `Itinerary cost (₹${itinerary.totalEstimatedCost}) exceeds budget (₹${aggregatedPrefs.budgetPerPerson}) by ${overByPercent.toFixed(0)}%`
    })
  }

  const hasCritical = issues.some(i => i.severity === 'critical')

  return {
    valid: !hasCritical,
    issues,
    calculatedCost: fullCalculatedCost
  }
}
const OUTDOOR_CATEGORIES = ['beaches', 'mountains', 'nature', 'adventure', 'photography']
const RAIN_THRESHOLD = 60

const validateWeather = (itinerary, forecast) => {
  const issues = []

  if (!forecast || forecast.length === 0) {
    return issues
  }

  const forecastByDate = {}
  forecast.forEach(day => {
    forecastByDate[day.date] = day
  })

  itinerary.days?.forEach(day => {
    const dayForecast = forecastByDate[day.date]

    if (!dayForecast) return

    if (dayForecast.precipitationProbability >= RAIN_THRESHOLD) {
      const outdoorActivities = day.activities?.filter(
        act => OUTDOOR_CATEGORIES.includes(act.category)
      ) || []

      outdoorActivities.forEach(activity => {
        issues.push({
          severity: 'moderate',
          type: 'weather_risk',
          message: `"${activity.title}" on Day ${day.day} (${day.date}) has ${dayForecast.precipitationProbability}% rain chance`,
          day: day.day,
          activityTitle: activity.title
        })
      })
    }
  })

  return issues
}

module.exports = { validateItineraryStructure, validateWeather, KNOWN_CATEGORIES }

