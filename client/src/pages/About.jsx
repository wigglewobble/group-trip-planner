const About = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-6">
        About TripNest
      </h1>

      <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4 text-gray-600 dark:text-gray-300 leading-7">
        <p>
          TripNest is an AI-powered collaborative travel planner designed to
          simplify group trip organization.
        </p>

        <p>
          Users can create trips, invite members through secure shareable links,
          collect preferences, generate AI-powered itineraries, maintain shared
          notes, and explore destinations through interactive maps.
        </p>

        <p>
          Built with React, Tailwind CSS, Node.js, Express, Prisma, PostgreSQL,
          Supabase Authentication, and AI services.
        </p>
      </div>
    </div>
  )
}

export default About