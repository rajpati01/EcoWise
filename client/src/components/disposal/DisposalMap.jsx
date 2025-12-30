import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix default markers for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const DisposalMap = ({ centers, userCoords, defaultCenter, bounds }) => {
  const mapRef = useRef(null);

  // Fit bounds when provided
  useEffect(() => {
    if (!bounds || !mapRef.current) return;
    try {
      const map = mapRef.current;
      if (map && map.fitBounds) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    } catch {}
  }, [bounds]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {centers.map((c) => {
        if (!c.lat || !c.lng) return null;
        return (
          <Marker key={c._id || c.id} position={[Number(c.lat), Number(c.lng)]}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs">{c.address}</div>
                {c.distanceKm != null && (
                  <div className="text-xs mt-1">~{c.distanceKm.toFixed(2)} km</div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]}>
          <Popup>Your location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default DisposalMap;
