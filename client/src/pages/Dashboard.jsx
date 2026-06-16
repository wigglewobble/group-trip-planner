import { useState, useEffect } from 'react'
import TripCard from '../components/ui/TripCard'
import CreateTripModal from '../components/ui/CreateTripModal'
import InvitesPanel from '../components/ui/InvitesPanel'
import { tripsApi, invitesApi } from '../services/api'

const Dashboard = () => {
  const [trips, setTrips] = useState([])
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

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
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl font-medium text-gray-900">My Trips</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {trips.length} trip{trips.length !== 1 ? 's' : ''} total
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-150 whitespace-nowrap flex-shrink-0"
        >
          <span className="text-base leading-none">+</span>
          <span className="hidden sm:inline">New Trip</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <InvitesPanel invites={invites} onResponded={handleInviteResponded} />

      {trips.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-1">No trips yet</p>
          <p className="text-sm">Create your first group trip to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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