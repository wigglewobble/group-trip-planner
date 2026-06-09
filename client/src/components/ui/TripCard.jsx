import { Link } from 'react-router-dom'
import StatusPill from './StatusPill'
import MemberAvatars from './MemberAvatars'

const TripCard = ({ trip }) => {
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
        <StatusPill status={trip.status} />
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <span>{trip.startDate}</span>
        <span>→</span>
        <span>{trip.endDate}</span>
      </div>

      <div className="flex items-center justify-between">
        <MemberAvatars members={trip.members} />
        <span className="text-xs text-gray-400">
          {trip.members.length} members
        </span>
      </div>
    </Link>
  )
}

export default TripCard