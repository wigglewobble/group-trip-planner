import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import '../../services/leafletFix'

const TripMap = ({ center, markers = [], height = '400px' }) => {
  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{marker.title}</p>
                {marker.time && <p className="text-gray-500 text-xs mt-0.5">{marker.time}</p>}
                {marker.description && <p className="text-gray-600 text-xs mt-1">{marker.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default TripMap