import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TripMap from '../components/ui/TripMap'
import { tripsApi, itineraryApi } from '../services/api'

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

const MapView = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [trip, setTrip] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDay, setSelectedDay] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { trip } = await tripsApi.getTrip(id)
        setTrip(trip)

        const { itinerary } = await itineraryApi.getActive(id)
        setItinerary(itinerary)
      } catch (err) {
        setError('Could not load trip map')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Loading map...</p>
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-gray-500">
          {error || 'No itinerary yet. Generate one first to see the map.'}
        </p>
        <button
          onClick={() => navigate(`/trip/${id}`)}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Back to trip
        </button>
      </div>
    )
  }

  const data = itinerary.data
  const currentDay = data.days?.find(d => d.day === selectedDay)

  const markers = currentDay?.activities
    ?.filter(act => act.coordinates)
    ?.map(act => ({
      lat: act.coordinates.lat,
      lng: act.coordinates.lng,
      title: act.title,
      time: act.time,
      description: act.location
    })) || []

  const mapCenter = markers.length > 0
    ? [markers[0].lat, markers[0].lng]
    : [20.5937, 78.9629]

  return (
    <div>
      <button
        onClick={() => navigate(`/trip/${id}`)}
        className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1"
      >
        ← Back to trip
      </button>

      <h1 className="text-xl font-medium text-gray-900 mb-1">{data.destination}</h1>
      <p className="text-sm text-gray-500 mb-4">Day-by-day map view</p>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {data.days?.map(day => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day)}
            className={`text-sm px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors duration-150 ${
              selectedDay === day.day
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <TripMap center={mapCenter} markers={markers} height="50vh" />

      <div className="mt-4 flex flex-col gap-2">
        <h2 className="text-sm font-medium text-gray-900 mb-1">
          Day {currentDay?.day} · {currentDay?.theme}
        </h2>

        {currentDay?.activities?.map((activity, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3"
          >
            <span className="text-xs text-gray-400 w-12 flex-shrink-0 pt-0.5">
              {activity.time}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[activity.category] || categoryColors.other}`}>
                  {activity.category}
                </span>
                {!activity.coordinates && activity.category !== 'logistics' && (
                  <span className="text-xs text-gray-400">· not on map</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{activity.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MapView