import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tripsApi, membersApi, itineraryApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MemberAvatars from '../components/ui/MemberAvatars'
import StatusPill from '../components/ui/StatusPill'
import InviteMemberModal from '../components/ui/InviteMemberModal'
import ItineraryDisplay from '../components/ui/ItineraryDisplay'
import NotesPanel from '../components/ui/NotesPanel'
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
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [itinerary, setItinerary] = useState(null)
    const [generating, setGenerating] = useState(false)
    const [generateError, setGenerateError] = useState('')
    const [validationIssues, setValidationIssues] = useState([])
    const [copied, setCopied] = useState(false)
    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const { trip } = await tripsApi.getTrip(id)
                
                setTrip(trip)

                const statusData = await membersApi.getStatus(id)
                setStatus(statusData)

                const { itinerary } = await itineraryApi.getActive(id)
                setItinerary(itinerary)
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
    const inviteUrl = `${window.location.origin}/join/${trip.inviteToken}`

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    const handleLeaveTrip = async () => {
        if (!confirm('Are you sure you want to leave this trip?')) return

        try {
            await membersApi.remove(trip.id, user.id)
            navigate('/')
        } catch (err) {
            alert(err.message || 'Failed to leave trip')
        }
    }
    const isAdmin = trip.adminId === user?.id

    const members =
        trip.members?.map(m => ({
            id: m.userId,
            name: m.user?.name || 'Unknown'
        })) || []

    const tripStatus = trip.status?.toLowerCase() || 'planning'

    const handleGenerate = async () => {
        setGenerateError('')
        setGenerating(true)
        try {
            const { itinerary, validationIssues } = await itineraryApi.generate(id)
            setItinerary(itinerary)
            setValidationIssues(validationIssues || [])
            setTrip(prev => ({ ...prev, status: 'READY', needsReplan: false, replanReason: null }))
        } catch (err) {
            if (err.issues) {
                setGenerateError(`${err.message}: ${err.issues.map(i => i.message).join(', ')}`)
            } else {
                setGenerateError(err.message || 'Failed to generate itinerary')
            }
        } finally {
            setGenerating(false)
        }
    }
    return (
        <div>
            <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 flex items-center gap-1">


                ← Back
            </button>

            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                            {trip.name}
                        </h1>
                        <StatusPill status={tripStatus} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {trip.destination}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {formatDate(trip.startDate)} →{' '}
                        {formatDate(trip.endDate)}
                    </p>
                </div>

                {!isAdmin && (
                    <button
                        onClick={handleLeaveTrip}
                        className="text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 whitespace-nowrap"
                    >
                        Leave trip
                    </button>
                )}
            </div>
            {trip.needsReplan && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-amber-800">Your plan may be outdated</p>
                        <p className="text-xs text-amber-700 mt-0.5">{trip.replanReason}</p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="text-sm bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                        {generating ? 'Regenerating...' : 'Regenerate now'}
                    </button>
                </div>
            )}

            {itinerary ? (
                <div className="flex flex-col gap-5">
                    <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Members:</span>
                            {trip.members?.filter(m => m.status === 'ACCEPTED').map(member => (
                                <div key={member.userId} className="flex items-center gap-1.5">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                        {member.user?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <span className="text-xs text-gray-600 dark:text-gray-300">{member.user?.name}</span>
                                    {trip.adminId === member.userId && (
                                        <span className="text-xs text-gray-400">(admin)</span>
                                    )}
                                </div>
                            ))}
                            <div className="flex gap-2">
                                {isAdmin && (
                                    <button
                                        onClick={() => setShowInviteModal(true)}
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1"
                                    >
                                        + Invite by email
                                    </button>
                                )}
                                <button
                                    onClick={handleCopyLink}
                                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1"
                                >
                                    {copied ? 'Link copied!' : 'Copy invite link'}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => navigate(`/trip/${trip.id}/preferences`)}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                            >
                                Edit preferences
                            </button>
                            <button
                                onClick={() => navigate(`/trip/${trip.id}/map`)}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                            >
                                View map
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generating ? 'Regenerating (30-60s)...' : ' Regenerate'}
                            </button>
                        </div>
                    </div>

                    <ItineraryDisplay
                        itinerary={itinerary}
                        validationIssues={validationIssues}
                    />
                    <NotesPanel tripId={trip.id} initialNotes={trip.notes} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                                    Members ({members.length})
                                </h2>

                                <div className="flex gap-2">
                                    {isAdmin && (
                                        <button
                                            onClick={() => setShowInviteModal(true)}
                                            className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-2 py-1"
                                        >
                                            + Invite
                                        </button>
                                    )}

                                    <button
                                        onClick={handleCopyLink}
                                        className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-2 py-1"
                                    >
                                        {copied ? 'Link copied!' : 'Copy link'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {trip.members?.map(member => (
                                    <div key={member.userId} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                                            {member.user?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {member.user?.name || 'Unknown'}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {trip.adminId === member.userId ? 'Admin' : 'Member'}
                                                {member.status === 'INVITED' && ' · Invite pending'}
                                                {member.status === 'ACCEPTED' && (
                                                    member.hasSubmitted ? ' · Prefs submitted' : ' · Prefs pending'
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <NotesPanel tripId={trip.id} initialNotes={trip.notes} />
                    </div>

                    <div className="md:col-span-2">
                        {generateError && (
                            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                {generateError}
                            </div>
                        )}

                        <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-5 min-h-48 flex flex-col items-center justify-center text-center gap-3">
                            {status && (
                                <div className="w-full max-w-xs">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                        <span>Preferences submitted</span>
                                        <span>{status.submitted} / {status.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${(status.submitted / status.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-gray-400 text-sm mb-1">No itinerary yet</p>
                                <p className="text-gray-400 text-xs">
                                    {status?.allSubmitted
                                        ? 'Everyone has submitted! Ready to generate.'
                                        : 'All members need to submit their preferences first'}
                                </p>
                            </div>

                            {status?.allSubmitted ? (
                                <button
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generating ? 'Generating itinerary (30-60s)...' : 'Generate itinerary'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate(`/trip/${trip.id}/preferences`)}
                                    className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Submit your preferences
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

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