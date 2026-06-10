import { Link } from 'react-router-dom'
import StatusPill from './StatusPill'
import MemberAvatars from './MemberAvatars'

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const TripCard = ({ trip }) => {
  const members = trip.members?.map(m => ({
    id: m.userId,
    name: m.user?.name || 'Unknown'
  })) || []

  const status = trip.status?.toLowerCase() || 'planning'

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-medium text-gray-900 mb-1">
            {trip.name}
          </h2>
          <p className="text-sm text-gray-500">{trip.destination}</p>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <span>{formatDate(trip.startDate)}</span>
        <span>→</span>
        <span>{formatDate(trip.endDate)}</span>
      </div>

      <div className="flex items-center justify-between">
        <MemberAvatars members={members} />
        <span className="text-xs text-gray-400">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
      </div>
    </Link>
  )
}

export default TripCard