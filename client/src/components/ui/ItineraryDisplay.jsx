const categoryColors = {
  beaches: 'bg-blue-50 text-blue-700',
  mountains: 'bg-green-50 text-green-700',
  food: 'bg-amber-50 text-amber-700',
  nightlife: 'bg-purple-50 text-purple-700',
  museums: 'bg-indigo-50 text-indigo-700',
  shopping: 'bg-pink-50 text-pink-700',
  nature: 'bg-emerald-50 text-emerald-700',
  adventure: 'bg-orange-50 text-orange-700',
  relaxation: 'bg-teal-50 text-teal-700',
  photography: 'bg-violet-50 text-violet-700',
  logistics: 'bg-gray-100 text-gray-600',
  culture: 'bg-rose-50 text-rose-700',
  other: 'bg-gray-100 text-gray-600',
}

const ItineraryDisplay = ({ itinerary }) => {
  const data = itinerary.data

  return (
    <div className="flex flex-col gap-5">

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-base font-medium text-gray-900 mb-2">
          {data.destination} · {data.totalDays} days
        </h2>
        <p className="text-sm text-gray-600">{data.summary}</p>
        <p className="text-sm text-gray-400 mt-3">
          Estimated cost per person: ₹{data.totalEstimatedCost?.toLocaleString('en-IN')}
        </p>
      </div>

      {data.hotelSuggestions?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Hotel suggestions</h3>
          <div className="flex flex-col gap-3">
            {data.hotelSuggestions.map((hotel, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800">{hotel.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{hotel.area}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{hotel.reason}</p>
                </div>
                <p className="text-gray-700 whitespace-nowrap">
                  ₹{hotel.estimatedCostPerNight?.toLocaleString('en-IN')}/night
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.days?.map(day => (
        <div key={day.day} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Day {day.day} · {day.theme}
            </h3>
            <span className="text-xs text-gray-400">{day.date}</span>
          </div>

          <div className="flex flex-col gap-3">
            {day.activities?.map((activity, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-xs text-gray-400 w-12 flex-shrink-0 pt-0.5">
                  {activity.time}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[activity.category] || categoryColors.other}`}>
                      {activity.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-400">{activity.location}</p>
                    {activity.estimatedCost > 0 && (
                      <p className="text-xs text-gray-400">
                        ₹{activity.estimatedCost.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  )
}

export default ItineraryDisplay