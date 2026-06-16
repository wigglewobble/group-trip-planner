import { Link, useLocation, useParams } from 'react-router-dom'

const BottomNav = () => {
  const location = useLocation()
  const { id } = useParams()

  const isTripPage = location.pathname.startsWith('/trip/') && id

  const defaultTabs = [
    { label: 'Trips', path: '/', icon: '🗺️' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ]

  const tripTabs = [
    { label: 'Overview', path: `/trip/${id}`, icon: '📋' },
    { label: 'Map', path: `/trip/${id}/map`, icon: '🗺️' },
    { label: 'Prefs', path: `/trip/${id}/preferences`, icon: '⚙️' },
  ]

  const tabs = isTripPage ? tripTabs : defaultTabs

  const isActive = (path) => {
    if (path === `/trip/${id}`) {
      return location.pathname === `/trip/${id}`
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs ${isActive(tab.path)
              ? 'text-gray-900 font-medium'
              : 'text-gray-400'
            }`}
        >
          <span className="text-lg">{tab.icon}</span>
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}

export default BottomNav