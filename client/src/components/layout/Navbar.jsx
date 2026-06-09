import { Link, useLocation } from 'react-router-dom'
const Navbar = () => {
    const location = useLocation()
    const links = [
        { label: 'Dashboard', path: '/' },
    ]
    return (
        <nav className="w-full border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
            <Link to="/" className="text-lg font-medium text-gray-900">
                TripSync</Link>

            <div className="hidden md:flex items-center gap-6">
                {links.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`text-sm ${location.pathname === link.path
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                    A
                </div>
            </div>
        </nav>
    )
}
export default Navbar