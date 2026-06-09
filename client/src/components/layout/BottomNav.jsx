import { Link, useLocation } from 'react-router-dom'

const BottomNav = () => {
  const location = useLocation()

  const tabs = [
    { label: 'Trips', path: '/', icon: '🗺️' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-50">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs ${
            location.pathname === tab.path
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