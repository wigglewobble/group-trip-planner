import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TripMap from '../components/ui/TripMap'
import { tripsApi, itineraryApi } from '../services/api'

const categoryColors = {
  beaches: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  mountains: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  nightlife: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  museums: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  shopping: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  nature: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  adventure: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  relaxation: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  photography: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  logistics: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  culture: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
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
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading map...</p>
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error || 'No itinerary yet. Generate one first to see the map.'}
        </p>
        <button
          onClick={() => navigate(`/trip/${id}`)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline"
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
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 flex items-center gap-1 transition-colors"
      >
        ← Back to trip
      </button>

      <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-1">{data.destination}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Day-by-day map view</p>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {data.days?.map(day => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day)}
            className={`text-sm px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors duration-150 ${
              selectedDay === day.day
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                : 'bg-white dark:bg-[#2f2f2f] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <TripMap center={mapCenter} markers={markers} height="50vh" />

      <div className="mt-4 flex flex-col gap-2">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          Day {currentDay?.day} · {currentDay?.theme}
        </h2>

        {currentDay?.activities?.map((activity, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-3 flex items-start gap-3"
          >
            <span className="text-xs text-gray-400 dark:text-gray-500 w-12 flex-shrink-0 pt-0.5 font-mono">
              {activity.time}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[activity.category] || categoryColors.other}`}>
                  {activity.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MapView