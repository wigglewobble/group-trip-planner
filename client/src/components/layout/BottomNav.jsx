import { Link, useLocation, useParams } from 'react-router-dom'

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)

const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
)

const SlidersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
    <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
    <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
    <line x1="17" y1="16" x2="23" y2="16"/>
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const BottomNav = () => {
  const location = useLocation()
  const { id } = useParams()

  const isTripPage = location.pathname.startsWith('/trip/') && id

  const defaultTabs = [
    { label: 'Trips', path: '/', icon: <GridIcon /> },
    { label: 'Profile', path: '/profile', icon: <UserIcon /> },
  ]

  const tripTabs = [
    { label: 'Overview', path: `/trip/${id}`, icon: <GridIcon /> },
    { label: 'Map', path: `/trip/${id}/map`, icon: <MapIcon /> },
    { label: 'Prefs', path: `/trip/${id}/preferences`, icon: <SlidersIcon /> },
  ]

  const tabs = isTripPage ? tripTabs : defaultTabs

  const isActive = (path) => {
    if (path === `/trip/${id}`) {
      return location.pathname === `/trip/${id}`
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#202020] border-t border-gray-200 dark:border-gray-800 flex md:hidden z-50 transition-colors duration-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${
            isActive(tab.path)
              ? 'text-gray-900 dark:text-white font-medium'
              : 'text-gray-400 dark:text-gray-600'
          }`}
        >
          {tab.icon}
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}

export default BottomNav