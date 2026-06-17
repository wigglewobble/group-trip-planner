import { useState, useEffect } from 'react'
import TripCard from '../components/ui/TripCard'
import CreateTripModal from '../components/ui/CreateTripModal'
import InvitesPanel from '../components/ui/InvitesPanel'
import { tripsApi, invitesApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const [trips, setTrips] = useState([])
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()

  const name = user?.user_metadata?.name?.split(' ')[0] || 'there'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsRes, invitesRes] = await Promise.all([
          tripsApi.getMyTrips(),
          invitesApi.getMyInvites()
        ])
        setTrips(tripsRes.trips)
        setInvites(invitesRes.invites)
      } catch (err) {
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTripCreated = (newTrip) => {
    setTrips(prev => [newTrip, ...prev])
  }

  const handleInviteResponded = async (tripId) => {
    setInvites(prev => prev.filter(inv => inv.tripId !== tripId))
    const { trips } = await tripsApi.getMyTrips()
    setTrips(trips)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Loading trips...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          Hey {name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {trips.length === 0
            ? 'Create your first group trip to get started'
            : `You have ${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`}
        </p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <InvitesPanel invites={invites} onResponded={handleInviteResponded} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Your trips
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-150"
        >
          <span className="text-base leading-none">+</span>
          New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div onClick={() => setShowModal(true)} className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-150">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-700 mx-auto mb-3">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">No trips yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Click to create your first group trip</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateTripModal
          onClose={() => setShowModal(false)}
          onCreated={handleTripCreated}
        />
      )}
    </div>
  )
}

export default Dashboard