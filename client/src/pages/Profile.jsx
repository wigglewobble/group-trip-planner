import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login')
  }

  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const email = user?.email || ''
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Profile</h1>

      <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl font-medium text-gray-600 dark:text-gray-300">
            {initial}
          </div>
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">{name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
            <span className="text-sm text-gray-900 dark:text-gray-100">{name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
            <span className="text-sm text-gray-900 dark:text-gray-100">{email}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium py-2 disabled:opacity-50 transition-colors"
        >
          {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </div>
  )
}

export default Profile