import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tripsApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MemberAvatars from '../components/ui/MemberAvatars'
import StatusPill from '../components/ui/StatusPill'
import InviteMemberModal from '../components/ui/InviteMemberModal'

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const TripPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showInviteModal, setShowInviteModal] = useState(false)

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const { trip } = await tripsApi.getTrip(id)
                setTrip(trip)
            } catch (err) {
                setError('Trip not found or you do not have access')
            } finally {
                setLoading(false)
            }
        }

        fetchTrip()
    }, [id])

    const handleMemberInvited = (newMember) => {
        setTrip(prev => ({
            ...prev,
            members: [...prev.members, newMember]
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-gray-400">Loading trip...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm text-red-500">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                    Back to dashboard
                </button>
            </div>
        )
    }

    const isAdmin = trip.adminId === user?.id
    const members = trip.members?.map(m => ({
        id: m.userId,
        name: m.user?.name || 'Unknown'
    })) || []
    const status = trip.status?.toLowerCase() || 'planning'

    return (
        <div>
            <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
            >
                ← Back
            </button>

            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-xl font-medium text-gray-900">{trip.name}</h1>
                        <StatusPill status={status} />
                    </div>
                    <p className="text-sm text-gray-500">{trip.destination}</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-900">
                                Members ({members.length})
                            </h2>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-2 py-1"
                                >
                                    + Invite
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            {trip.members.map(member => (
                                <div
                                    key={member.userId}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                                        {member.user?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {member.user?.name || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {trip.adminId === member.userId ? 'Admin' : 'Member'}
                                            {member.status === 'INVITED' && ' · Invite pending'}
                                            {member.status === 'ACCEPTED' && (member.hasSubmitted ? ' · Prefs submitted' : ' · Prefs pending')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 min-h-48 flex flex-col items-center justify-center text-center">
                        <p className="text-gray-400 text-sm mb-1">No itinerary yet</p>
                        <p className="text-gray-400 text-xs">
                            All members need to submit their preferences first
                        </p>
                    </div>
                </div>
            </div>

            {showInviteModal && (
                <InviteMemberModal
                    tripId={trip.id}
                    onClose={() => setShowInviteModal(false)}
                    onInvited={handleMemberInvited}
                />
            )}
        </div>
    )
}

export default TripPage