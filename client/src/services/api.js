import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`
  }
}

export const tripsApi = {
  getMyTrips: async () => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/trips/my`, { headers })
    if (!res.ok) throw new Error('Failed to fetch trips')
    return res.json()
  },

  getTrip: async (id) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/trips/${id}`, { headers })
    if (!res.ok) throw new Error('Failed to fetch trip')
    return res.json()
  },

  createTrip: async (tripData) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/trips`, {
      method: 'POST',
      headers,
      body: JSON.stringify(tripData)
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create trip')
    }
    return res.json()
  },

  deleteTrip: async (id) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/trips/${id}`, {
      method: 'DELETE',
      headers
    })
    if (!res.ok) throw new Error('Failed to delete trip')
    return res.json()
  }
}