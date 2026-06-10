import {Navigate} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'

const ProtectedRoute=({children})=>{
    const { isLoggedIn,loading}=useAuth()

    if(loading){
        return(
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading...</p>
            </div>
        )
    }

    if(!isLoggedIn){
        return <Navigate to="/login" replace />
    }
    return children
}
export default ProtectedRoute