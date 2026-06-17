import { useState } from 'react'
import { invitesApi } from '../../services/api'

const InvitesPanel = ({ invites, onResponded }) => {
  const [respondingTo, setRespondingTo] = useState(null)

  const handleRespond = async (tripId, accept) => {
    setRespondingTo(tripId)
    try {
      await invitesApi.respond(tripId, accept)
      onResponded(tripId)
    } catch (err) {
      alert(err.message || 'Failed to respond')
    } finally {
      setRespondingTo(null)
    }
  }

  if (invites.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Pending invites ({invites.length})
      </h2>
      <div className="flex flex-col gap-2">
        {invites.map(invite => (
          <div
            key={invite.id}
            className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{invite.trip.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{invite.trip.destination}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRespond(invite.tripId, false)}
                disabled={respondingTo === invite.tripId}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => handleRespond(invite.tripId, true)}
                disabled={respondingTo === invite.tripId}
                className="text-sm text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 rounded-lg px-3 py-1.5 disabled:opacity-50 transition-colors"
              >
                Accept
          </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InvitesPanel