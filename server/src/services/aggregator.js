const aggregatePreferences = (members) => {
  const submittedMembers = members.filter(m => m.hasSubmitted)

  if (submittedMembers.length === 0) {
    throw new Error('No members have submitted preferences')
  }

  const budgets = submittedMembers.map(m => m.budget)
  const minBudget = Math.min(...budgets)

  const interestCounts = {}
  submittedMembers.forEach(member => {
    member.interests.forEach(interest => {
      interestCounts[interest] = (interestCounts[interest] || 0) + 1
    })
  })

  const totalMembers = submittedMembers.length
  const rankedInterests = Object.entries(interestCounts)
    .map(([interest, count]) => ({
      interest,
      count,
      percentage: Math.round((count / totalMembers) * 100)
    }))
    .sort((a, b) => b.count - a.count)

  const coreInterests = rankedInterests
    .filter(i => i.percentage >= 50)
    .map(i => i.interest)

  const bonusInterests = rankedInterests
    .filter(i => i.percentage < 50)
    .map(i => i.interest)

  const energyLevel = getMode(
    submittedMembers.map(m => m.energyLevel),
    'medium'
  )

  const travelStyle = getMode(
    submittedMembers.map(m => m.travelStyle),
    'balanced'
  )

  return {
    groupSize: totalMembers,
    budgetPerPerson: minBudget,
    coreInterests,
    bonusInterests,
    energyLevel,
    travelStyle,
    rawBudgets: budgets,
  }
}

const getMode = (values, tieBreakDefault) => {
  const counts = {}
  values.forEach(v => {
    counts[v] = (counts[v] || 0) + 1
  })

  const maxCount = Math.max(...Object.values(counts))
  const modes = Object.keys(counts).filter(k => counts[k] === maxCount)

  if (modes.length === 1) {
    return modes[0]
  }

  return modes.includes(tieBreakDefault) ? tieBreakDefault : modes[0]
}

module.exports = { aggregatePreferences }