import TripMap from '../components/ui/TripMap'

const MapView = () => {
  const testMarkers = [
    { lat: 15.5736, lng: 73.7651, title: 'Anjuna Beach', time: '17:00', description: 'Beach exploration' },
    { lat: 15.5993, lng: 73.7423, title: 'Chapora Fort', time: '11:30', description: 'Panoramic views' },
    { lat: 15.6131, lng: 73.7378, title: 'Vagator Beach', time: '18:30', description: 'Sunset spot' },
  ]

  return (
    <div>
      <h1 className="text-xl font-medium text-gray-900 mb-4">Map test</h1>
      <TripMap center={[15.59, 73.75]} markers={testMarkers} height="500px" />
    </div>
  )
}

export default MapView