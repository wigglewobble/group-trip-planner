import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signup, login, isLoggedIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const validationError = validate()
      if (validationError) throw new Error(validationError)

      await signup(form.email, form.password, form.name)
      await login(form.email, form.password)

      const pendingToken = localStorage.getItem('pendingInviteToken')

      if (pendingToken) {
        localStorage.removeItem('pendingInviteToken')
        navigate(`/join/${pendingToken}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (!authLoading && isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#191919] flex items-center justify-center px-4 transition-colors duration-200">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">TripNest</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your account</p>
        </div>

        <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          {error && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Abhranil Das"
                required
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2f2f2f] text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2f2f2f] text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2f2f2f] text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2f2f2f] text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 dark:text-white font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Signup