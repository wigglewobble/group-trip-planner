const categoryConfig = {
  beaches: { color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300', icon: '~' },
  mountains: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: '^' },
  food: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', icon: 'f' },
  nightlife: { color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', icon: 'n' },
  museums: { color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', icon: 'm' },
  shopping: { color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300', icon: 's' },
  nature: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: 'n' },
  adventure: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', icon: 'a' },
  relaxation: { color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', icon: 'r' },
  photography: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: 'p' },
  logistics: { color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400', icon: 'l' },
  culture: { color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300', icon: 'c' },
  other: { color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400', icon: 'o' },
}

const CategoryDot = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig.other
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded font-medium ${config.color}`}>
      {category}
    </span>
  )
}

const ActivityCard = ({ activity, index }) => {
  return (
    <div className="bg-white dark:bg-[#252525] border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
          {activity.time}
        </span>
        {activity.estimatedCost > 0 && (
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            ₹{activity.estimatedCost.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 leading-snug">
        {activity.title}
      </h4>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
        {activity.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <CategoryDot category={activity.category} />
        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {activity.location}
        </span>
      </div>
    </div>
  )
}

const ItineraryDisplay = ({ itinerary, validationIssues = [] }) => {
  const data = itinerary.data
  const moderateOrMinorIssues = validationIssues.filter(i => i.severity !== 'critical')

  return (
    <div className="flex flex-col gap-8">

      {moderateOrMinorIssues.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Heads up</p>
          <ul className="flex flex-col gap-1">
            {moderateOrMinorIssues.map((issue, idx) => (
              <li key={idx} className="text-xs text-amber-700 dark:text-amber-400">
                · {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white dark:bg-[#252525] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {data.destination}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {data.totalDays} day itinerary
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ₹{data.totalEstimatedCost?.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">per person</p>
          </div>
        </div>
        <div className="h-px bg-gray-100 dark:bg-gray-800 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {data.summary}
        </p>
      </div>

      {data.hotelSuggestions?.length > 0 && (
        <div className="bg-white dark:bg-[#252525] border border-gray-100 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Where to stay
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {data.hotelSuggestions.map((hotel, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{hotel.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hotel.area}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{hotel.reason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    ₹{hotel.estimatedCostPerNight?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">/ night</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.days?.map(day => (
        <div key={day.day}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold flex-shrink-0">
              {day.day}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {day.theme}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {day.activities?.map((activity, idx) => (
              <ActivityCard key={idx} activity={activity} index={idx} />
            ))}
          </div>
        </div>
      ))}

    </div>
  )
}

export default ItineraryDisplay