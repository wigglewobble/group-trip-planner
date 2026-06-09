const statusStyles = {
  planning: 'bg-blue-50 text-blue-700 border border-blue-200',
  ready: 'bg-green-50 text-green-700 border border-green-200',
  replanning: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const statusLabels = {
  planning: 'Planning',
  ready: 'Itinerary Ready',
  replanning: 'Re-planning',
}

const StatusPill = ({ status }) => {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}

export default StatusPill