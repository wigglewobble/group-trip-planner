import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  const dest = trip.destination?.split(',')[0]?.trim()

  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(dest)}`
        )
        const data = await res.json()
        if (data?.thumbnail?.source) {
          setImageUrl(data.thumbnail.source)
        }
      } catch (err) {
        // silently fail, fallback gradient shows
      }
    }

    if (dest) fetchImage()
  }, [dest])

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="block rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 relative"
      style={{ minHeight: '220px' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundColor: imageUrl ? undefined : '#1f2937',
          opacity: imageUrl ? 1 : 1
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

      <div className="relative h-full flex flex-col justify-between p-4" style={{ minHeight: '220px' }}>
        <div className="flex justify-end">
          <StatusPill status={status} variant="card" />
        </div>

        <div>
          <h2 className="text-lg font-medium text-white mb-0.5">
            {trip.name}
          </h2>
          <p className="text-sm text-white/70 mb-2">{trip.destination}</p>
          <p className="text-xs text-white/60 mb-4">
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </p>

          <div className="flex items-center justify-between">
            <MemberAvatars members={members} />
            <span className="text-xs text-white/60">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TripCard