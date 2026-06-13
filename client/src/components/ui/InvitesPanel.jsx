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
      <h2 className="text-sm font-medium text-gray-900 mb-3">
        Pending invites ({invites.length})
      </h2>
      <div className="flex flex-col gap-2">
        {invites.map(invite => (
          <div
            key={invite.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{invite.trip.name}</p>
              <p className="text-xs text-gray-500">{invite.trip.destination}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRespond(invite.tripId, false)}
                disabled={respondingTo === invite.tripId}
                className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 disabled:opacity-50"
              >
                Decline
              </button>
              <button
                onClick={() => handleRespond(invite.tripId, true)}
                disabled={respondingTo === invite.tripId}
                className="text-sm text-white bg-gray-900 hover:bg-gray-700 rounded-lg px-3 py-1.5 disabled:opacity-50"
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