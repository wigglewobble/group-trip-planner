import { useState } from 'react'
import TripCard from '../components/ui/TripCard'
import { mockTrips } from '../services/mockData'

const Dashboard = () => {
  const [trips] = useState(mockTrips)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">My Trips</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {trips.length} trip{trips.length !== 1 ? 's' : ''} total
          </p>
        </div>

        <button
          onClick={() => alert('Create trip — coming soon!')}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-150"
        >
          <span className="text-base leading-none">+</span>
          New Trip
        </button>
      </div>

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
    </div>
  )
}

export default Dashboard