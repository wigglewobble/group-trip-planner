const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-6">
        Privacy Policy
      </h1>

      <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4 text-gray-600 dark:text-gray-300 leading-7">
        <p>
          TripNest collects basic account information such as your name and
          email address, along with trip-related data including preferences,
          notes, and itineraries.
        </p>

        <p>
          Authentication is handled securely through Supabase. Your information
          is used solely to provide and improve TripNest services.
        </p>

        <p>
          TripNest does not sell or share personal information with third
          parties except for services required to operate the platform.
        </p>

        <p>
          By using TripNest, you consent to the collection and storage of this
          information.
        </p>
      </div>
    </div>
  )
}

export default Privacy