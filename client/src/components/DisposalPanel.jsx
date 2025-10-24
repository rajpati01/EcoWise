import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import DisposalRequestForm from "./DisposalRequestForm";
import { AuthContext } from "../context/AuthContext";
import * as disposalService from "../services/disposalService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Basic marker icon fix for many bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export default function DisposalPanel({
  classification = null,
  onCreated = () => {},
}) {
  const { token } = useContext(AuthContext) || {};
  const [userCoords, setUserCoords] = useState(null);
  const [centers, setCenters] = useState([]);
  const [nearestCenters, setNearestCenters] = useState([]);
  const [initialCenterId, setInitialCenterId] = useState("");
  const [mapBounds, setMapBounds] = useState(null);
  const mapRef = useRef(null);

  // Helper: compute Haversine distance in km
  const haversineKm = (lat1, lon1, lat2, lon2) => {
    if ([lat1, lon1, lat2, lon2].some((v) => v == null)) return Infinity;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Get user geolocation (best-effort)
  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserCoords(null),
      { timeout: 5000 }
    );
  }, []);

  // Fetch centers whenever classification or userCoords change
  useEffect(() => {
    let mounted = true;
    async function fetchCenters() {
      try {
        const categoryParam = classification
          ? classification.category
          : undefined;
        const lat = userCoords?.lat;
        const lng = userCoords?.lng;
        const res = await disposalService.listCenters({
          lat,
          lng,
          limit: 50,
          category: categoryParam,
        });
        const list = res && res.centers ? res.centers : [];
        // compute distanceKm where lat/lng present
        const enriched = list.map((c) => {
          const clat = Number(c.lat);
          const clng = Number(c.lng);
          const distanceKm =
            lat != null &&
            lng != null &&
            !Number.isNaN(clat) &&
            !Number.isNaN(clng)
              ? haversineKm(lat, lng, clat, clng)
              : null;
          return { ...c, distanceKm };
        });
        if (!mounted) return;
        setCenters(enriched);

        // pick nearest 2-3 if user coords available; otherwise pick top 3 by availability
        let nearest = enriched.slice();
        if (userCoords) {
          nearest = nearest
            .filter((n) => n.distanceKm != null)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, 3);
        } else {
          nearest = nearest.slice(0, 3);
        }
        setNearestCenters(nearest);
        if (nearest.length > 0) {
          setInitialCenterId(nearest[0]._id || nearest[0].id || "");
          // set map bounds to show nearest
          const bounds = nearest
            .filter((c) => c.lat !== undefined && c.lng !== undefined)
            .map((c) => [Number(c.lat), Number(c.lng)]);
          if (bounds.length > 0) setMapBounds(bounds);
        } else {
          // fallback: show all centers
          const allBounds = enriched
            .filter((c) => c.lat && c.lng)
            .map((c) => [Number(c.lat), Number(c.lng)]);
          if (allBounds.length > 0) setMapBounds(allBounds);
        }
      } catch (err) {
        console.error("Failed to load disposal centers:", err);
        if (!mounted) return;
        setCenters([]);
        setNearestCenters([]);
      }
    }
    fetchCenters();
    return () => {
      mounted = false;
    };
  }, [classification, userCoords]);

  // When mapBounds changes, try to fit bounds on the map
  useEffect(() => {
    if (!mapBounds || !mapRef.current) return;
    try {
      const map = mapRef.current;
      if (map && map.fitBounds) {
        map.fitBounds(mapBounds, { padding: [40, 40] });
      }
    } catch (err) {
      // ignore
    }
  }, [mapBounds]);

  const handleCreated = (created) => {
    onCreated(created);
  };

  // default center for initial map view
  const defaultCenter = userCoords
    ? [userCoords.lat, userCoords.lng]
    : centers[0] && centers[0].lat && centers[0].lng
    ? [Number(centers[0].lat), Number(centers[0].lng)]
    : [27.7, 85.33];

  return (
    <div className="mt-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Smart Disposal Centers
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Find nearby recycling centers, disposal facilities, and collection
          points with our interactive map.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-3 text-sm text-gray-600">
            The classifier result is used to pre-fill the disposal form below.
            You can adjust fields (mode, quantity, center, schedule) before
            submitting.
          </div>

          <DisposalRequestForm
            initial={{
              wasteType:
                classification?.suggestedWasteType ||
                classification?.label ||
                "",
              category: classification?.category
                ? ["electronic", "ewaste", "battery", "chemical"].some((k) =>
                    String(classification.category).toLowerCase().includes(k)
                  )
                  ? "hazardous"
                  : "recyclable"
                : "recyclable",
              quantity: classification?.estimatedQuantity || 1,
              unit: "kg",
              mode: "pickup",
              notes: classification?.note || "",
              scheduledAt: null,
            }}
            authToken={token}
            centers={nearestCenters.length ? nearestCenters : centers}
            initialCenterId={initialCenterId}
            userCoords={userCoords}
            onCreated={handleCreated}
          />
        </div>

        <aside className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium mb-2">Nearby Disposal Centers</h4>

          <div className="h-64 mb-3">
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
                  <Marker
                    key={c._id || c.id}
                    position={[Number(c.lat), Number(c.lng)]}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs">{c.address}</div>
                        {c.distanceKm != null && (
                          <div className="text-xs mt-1">
                            ~{c.distanceKm.toFixed(2)} km
                          </div>
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
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            {nearestCenters.length > 0 ? (
              nearestCenters.map((c) => (
                <div key={c._id || c.id} className="p-2 border rounded">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-600">{c.address}</div>
                  {c.distanceKm != null && (
                    <div className="text-xs mt-1">
                      ~{c.distanceKm.toFixed(2)} km
                    </div>
                  )}
                </div>
              ))
            ) : centers.length > 0 ? (
              centers.slice(0, 3).map((c) => (
                <div key={c._id || c.id} className="p-2 border rounded">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-600">{c.address}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No centers available.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
