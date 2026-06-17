const statusConfig = {
  planning: {
    label: 'Planning',
    className: 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
  },
  ready: {
    label: 'Itinerary Ready',
    className: 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
  },
  replanning: {
    label: 'Re-planning',
    className: 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
  },
}

const statusConfig_page = {
  planning: {
    label: 'Planning',
    className: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
  },
  ready: {
    label: 'Itinerary Ready',
    className: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
  },
  replanning: {
    label: 'Re-planning',
    className: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
  },
}

const StatusPill = ({ status, variant = 'default' }) => {
  const config = variant === 'card'
    ? (statusConfig[status] || statusConfig.planning)
    : (statusConfig_page[status] || statusConfig_page.planning)

  const label = statusConfig_page[status]?.label || 'Planning'

  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md font-medium ${config.className}`}>
      {label}
    </span>
  )
}

export default StatusPill