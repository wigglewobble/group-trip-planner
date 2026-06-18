import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const syncUserToBackend = async (supabaseUser, name) => {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    try {
      await fetch(`${BASE_URL}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: name || supabaseUser.user_metadata?.name || 'User'
        })
      })
    } catch (err) {
      console.error('User sync error:', err)
    }
  }

  const signup = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })

    if (error) throw error

    if (data.user) {
      await syncUserToBackend(data.user, name)
    }

    return data
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  }

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    signup,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}