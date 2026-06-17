import { useState, useEffect, useRef } from 'react'
import { tripsApi } from '../../services/api'

const NotesPanel = ({ tripId, initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const timerRef = useRef(null)

  const handleChange = (e) => {
    setNotes(e.target.value)
    setSaved(false)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        await tripsApi.updateNotes(tripId, e.target.value)
        setSaved(true)
      } catch (err) {
        console.error('Notes save failed:', err)
      } finally {
        setSaving(false)
      }
    }, 1000)
  }

  return (
    <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Shared notes
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {saving ? 'Saving...' : saved ? 'Saved' : 'Auto-saves'}
        </span>
      </div>
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Taxi number, hotel check-in code, flight PNR, anything useful..."
        rows={5}
        className="w-full text-sm text-gray-800 dark:text-gray-200 bg-transparent placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none leading-relaxed"
      />
    </div>
  )
}

export default NotesPanel