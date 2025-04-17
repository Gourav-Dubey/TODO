import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";

// Default marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function ClickHandler({ onMapClick }) {
    useMapEvents({
      click: (e) => {
        if (onMapClick) onMapClick(e.latlng);
      },
    });
    return null;
  }

function TaskMap({ tasks, location,onMapClick}) {
  const center = location || { lat: 22.8524, lng: 78.6301 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={15}
      scrollWheelZoom={true}
      className="h-[400px] rounded-xl shadow-xl z-0"
      
    >
      
        
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
<ClickHandler onMapClick={onMapClick} />
      {tasks.map((task, idx) => (
        <Marker key={idx} position={[task.lat, task.lng]}>
          <Popup>
            <strong>{task.name}</strong> <br />
            ({task.lat.toFixed(4)}, {task.lng.toFixed(4)})
          </Popup>
        </Marker>
      ))}

      {location && (
        <Marker position={[location.lat, location.lng]}>
          <Popup>You are here 📍</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default TaskMap;
