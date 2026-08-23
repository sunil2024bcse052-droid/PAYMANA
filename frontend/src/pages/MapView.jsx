import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/projects';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default marker icon paths (a common issue when using
// Leaflet with a bundler like Vite - without this, pins don't show up)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const statusColors = {
  PLANNED: '#94a3b8',
  ONGOING: '#3b82f6',
  DELAYED: '#ef4444',
  COMPLETED: '#22c55e',
};

function MapView() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getProjects()
      .then((data) => {
        if (!ignore) {
          const withCoords = data.data.filter((p) => p.latitude && p.longitude);
          setProjects(withCoords);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading map...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

  const indiaCenter = [22.5, 79.0];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>Project Map</h1>
      <p style={{ color: '#64748b' }}>{projects.length} projects shown with known locations</p>

      <div style={{ height: '600px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <MapContainer center={indiaCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {projects.map((project) => (
            <Marker key={project.id} position={[project.latitude, project.longitude]}>
              <Popup>
                <strong>{project.name}</strong>
                <br />
                <span style={{ color: statusColors[project.status] }}>{project.status}</span>
                <br />
                {project.percentComplete}% complete
                <br />
                <Link to={`/projects/${project.id}`}>View Details</Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;