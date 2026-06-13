import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import InterestChip from '../components/ui/InterestChip'
import OptionCard from '../components/ui/OptionCard'
import { INTERESTS_OPTIONS, ENERGY_LEVELS, TRAVEL_STYLES } from '../services/constants'

const PreferenceForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        budget: '',
        interests: [],
        energyLevel: '',
        travelStyle: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const toggleInterest = (value) => {
        setForm(prev => {
            const isSelected = prev.interests.includes(value)
            return {
                ...prev,
                interests: isSelected
                    ? prev.interests.filter(i => i !== value)
                    : [...prev.interests, value]
            }
        })
    }

    const validate = () => {
        if (!form.budget || Number(form.budget) <= 0) {
            return 'Please enter a valid budget'
        }
        if (form.interests.length === 0) {
            return 'Select at least one interest'
        }
        if (!form.energyLevel) {
            return 'Select your energy level'
        }
        if (!form.travelStyle) {
            return 'Select your travel style'
        }
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        try {

            console.log('Preferences submitted:', form)
            navigate(`/trip/${id}`)
        } catch (err) {
            setError(err.message || 'Failed to save preferences')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate(`/trip/${id}`)}
                className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
            >
                ← Back to trip
            </button>

            <div className="mb-6">
                <h1 className="text-xl font-medium text-gray-900">Your preferences</h1>
                <p className="text-sm text-gray-500 mt-1">
                    This helps the AI plan a trip that works for everyone.
                </p>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <label className="text-sm font-medium text-gray-900 mb-1 block">
                        Your budget
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        Total amount you're comfortable spending for this trip (₹)
                    </p>
                    <input
                        type="number"
                        min="0"
                        step="500"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        placeholder="e.g. 15000"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                    />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <label className="text-sm font-medium text-gray-900 mb-1 block">
                        What are you interested in?
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        Select all that apply
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {INTERESTS_OPTIONS.map(option => (
                            <InterestChip
                                key={option.value}
                                label={option.label}
                                selected={form.interests.includes(option.value)}
                                onClick={() => toggleInterest(option.value)}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <label className="text-sm font-medium text-gray-900 mb-1 block">
                        Energy level
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        How active do you want this trip to be?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {ENERGY_LEVELS.map(option => (
                            <OptionCard
                                key={option.value}
                                label={option.label}
                                description={option.description}
                                selected={form.energyLevel === option.value}
                                onClick={() => setForm({ ...form, energyLevel: option.value })}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <label className="text-sm font-medium text-gray-900 mb-1 block">
                        Travel style
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        How packed should each day be?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {TRAVEL_STYLES.map(option => (
                            <OptionCard
                                key={option.value}
                                label={option.label}
                                description={option.description}
                                selected={form.travelStyle === option.value}
                                onClick={() => setForm({ ...form, travelStyle: option.value })}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 text-white text-sm font-medium py-3 rounded-lg hover:bg-gray-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : 'Submit preferences'}
                </button>

            </form>
        </div>
    )
}

export default PreferenceForm