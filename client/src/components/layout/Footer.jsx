import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <p>© 2026 TripNest. All rights reserved.</p>

        <div className="flex items-center gap-5">
          <Link to="/about" className="hover:text-gray-900 dark:hover:text-white">
            About
          </Link>

          <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white">
            Privacy
          </Link>

          <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white">
            Terms
          </Link>

          <Link to="/contact" className="hover:text-gray-900 dark:hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer