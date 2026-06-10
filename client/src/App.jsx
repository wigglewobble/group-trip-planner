import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import TripPage from './pages/TripPage'
import PreferenceForm from './pages/PreferenceForm'
import MapView from './pages/MapView'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/trip/:id" element={
          <ProtectedRoute>
            <Layout><TripPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/trip/:id/preferences" element={
          <ProtectedRoute>
            <Layout><PreferenceForm /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/trip/:id/map" element={
          <ProtectedRoute>
            <Layout><MapView /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App