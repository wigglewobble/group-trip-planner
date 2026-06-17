import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { tripsApi } from '../services/api'

const JoinTrip = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [tripName, setTripName] = useState('')

  useEffect(() => {
    if (authLoading) return

    if (!isLoggedIn) {
      localStorage.setItem('pendingInviteToken', token)
      navigate(`/login?next=/join/${token}`)
      return
    }

    const joinTrip = async () => {
      try {
        const { trip, alreadyMember } = await tripsApi.joinViaToken(token)
        setTripName(trip.name)
        setStatus(alreadyMember ? 'already_member' : 'success')
        setTimeout(() => navigate(`/trip/${trip.id}`), 2000)
      } catch (err) {
        setError(err.message)
        setStatus('error')
      }
    }

    joinTrip()
  }, [token, isLoggedIn, authLoading])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#191919] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">TripSync</h1>

        {status === 'loading' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Joining trip...</p>
        )}

        {status === 'success' && (
          <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mt-6">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              You've joined {tripName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Redirecting to trip...
            </p>
          </div>
        )}

        {status === 'already_member' && (
          <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mt-6">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              You're already in {tripName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Redirecting to trip...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mt-6">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
            >
              Go to dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JoinTrip