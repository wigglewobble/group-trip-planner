import Navbar from './Navbar'
import BottomNav from './BottomNav'

const Layout=({children})=>{
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar/>
            <main className="flex-1 w-full max-w-5x1 mx-auto px-4 py-6 pb-24 md:pb-6">
                {children}
            </main>
            <BottomNav/>
        </div>
        
    )
}
export default Layout