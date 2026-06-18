import Navbar from './Navbar'
import BottomNav from './BottomNav'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#191919] flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 pb-32 md:pb-6">
        {children}
      </main>

      <div className="pb-20 md:pb-0">
        <Footer />
      </div>

      <BottomNav />
    </div>
  )
}

export default Layout