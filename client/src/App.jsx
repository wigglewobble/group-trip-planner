import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
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

        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/trip/:id" element={<Layout><TripPage /></Layout>} />
        <Route path="/trip/:id/preferences" element={<Layout><PreferenceForm /></Layout>} />
        <Route path="/trip/:id/map" element={<Layout><MapView /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App