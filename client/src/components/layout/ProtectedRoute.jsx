import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth()
  const [showSlowMessage, setShowSlowMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowMessage(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#191919] flex flex-col items-center justify-center gap-3 transition-colors">
        <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-700 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        {showSlowMessage && (
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs text-center px-4">
            Taking longer than usual — the server may be waking up from sleep. This can take up to 60 seconds on free tier hosting.
          </p>
        )}
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute