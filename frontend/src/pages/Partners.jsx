import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed, Phone, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import { EmptyState } from '../components/States';

// Default marker icon fix for bundlers
const icon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Partners() {
  const [params, setParams] = useSearchParams();
  const schemeId = params.get('schemeId') || '';
  const [schemes, setSchemes] = useState([]);
  const [coords, setCoords] = useState({ lat: 17.4062, lng: 78.4691 }); // default Hyderabad
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/schemes').then(({ data }) => setSchemes(data.schemes));
  }, []);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {} // silently keep default if denied
    );
  };

  const search = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/partners/nearby', {
        latitude: coords.lat,
        longitude: coords.lng,
        schemeId: schemeId || undefined,
        maxDistanceKm: 300,
      });
      setPartners(data.partners);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); /* eslint-disable-next-line */ }, [coords, schemeId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Channel Partner Locator</h1>
      <p className="text-sm text-slate-500 mb-6">Suitable nearby channel partners — not ranked as "best". Financial/operational fields are prototype/demo data.</p>

      <div className="flex flex-wrap gap-3 mb-5">
        <select className="input max-w-xs" value={schemeId} onChange={(e) => setParams(e.target.value ? { schemeId: e.target.value } : {})}>
          <option value="">All schemes</option>
          {schemes.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <button onClick={locateMe} className="btn-secondary"><LocateFixed size={16} /> Use my location</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card overflow-hidden h-[420px]">
          <MapContainer center={[coords.lat, coords.lng]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <Marker position={[coords.lat, coords.lng]} icon={icon}>
              <Popup>Your location</Popup>
            </Marker>
            {partners.map((p) => (
              <Marker key={p._id} position={[p.latitude, p.longitude]} icon={icon}>
                <Popup>
                  <strong>{p.name}</strong><br />
                  {p.type} · {p.distanceKm} km away<br />
                  {p.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {loading && <p className="text-sm text-slate-400">Searching...</p>}
          {!loading && partners.length === 0 && <EmptyState title="No partners found nearby" />}
          {partners.map((p) => (
            <div key={p._id} className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400">{p.type}</p>
                  <h4 className="font-semibold text-slate-800">{p.name}</h4>
                </div>
                <span className="badge bg-brand-50 text-brand-700">{p.distanceKm} km</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{p.address}</p>
              <p className="text-xs text-amber-600 mt-2">{p.dataLabel}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                {p.phone && <span className="flex items-center gap-1"><Phone size={12} /> {p.phone}</span>}
                {p.sourceUrl && <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="text-brand-600 flex items-center gap-1">Source <ExternalLink size={11} /></a>}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Last verified: {new Date(p.lastVerifiedAt).toDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
