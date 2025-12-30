import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import * as disposalService from "@/services/disposalService";
import DisposalRequestForm from "./DisposalRequestForm";
import DisposalPanelHeader from "./DisposalPanelHeader";
import DisposalMap from "./DisposalMap";
import DisposalCentersList from "./DisposalCentersList";

export default function DisposalPanel({ classification = null, onCreated = () => {} }) {
  const { token } = useContext(AuthContext) || {};
  const [userCoords, setUserCoords] = useState(null);
  const [centers, setCenters] = useState([]);
  const [nearestCenters, setNearestCenters] = useState([]);
  const [initialCenterId, setInitialCenterId] = useState("");
  const [mapBounds, setMapBounds] = useState(null);

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
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserCoords(null),
      { timeout: 5000 }
    );
  }, []);

  // Fetch centers whenever classification or userCoords change
  useEffect(() => {
    let mounted = true;
    async function fetchCenters() {
      try {
        const categoryParam = classification ? classification.category : undefined;
        const lat = userCoords?.lat;
        const lng = userCoords?.lng;
        const res = await disposalService.listCenters({ lat, lng, limit: 50, category: categoryParam });
        const list = res && res.centers ? res.centers : [];
        // compute distanceKm where lat/lng present
        const enriched = list.map((c) => {
          const clat = Number(c.lat);
          const clng = Number(c.lng);
          const distanceKm = lat != null && lng != null && !Number.isNaN(clat) && !Number.isNaN(clng)
            ? haversineKm(lat, lng, clat, clng)
            : null;
          return { ...c, distanceKm };
        });
        if (!mounted) return;
        setCenters(enriched);

        // pick nearest 2-3 if user coords available; otherwise pick top 3 by availability
        let nearest = enriched.slice();
        if (userCoords) {
          nearest = nearest.filter((n) => n.distanceKm != null).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
        } else {
          nearest = nearest.slice(0, 3);
        }
        setNearestCenters(nearest);
        if (nearest.length > 0) {
          setInitialCenterId(nearest[0]._id || nearest[0].id || "");
          const bounds = nearest
            .filter((c) => c.lat !== undefined && c.lng !== undefined)
            .map((c) => [Number(c.lat), Number(c.lng)]);
          if (bounds.length > 0) setMapBounds(bounds);
        } else {
          const allBounds = enriched.filter((c) => c.lat && c.lng).map((c) => [Number(c.lat), Number(c.lng)]);
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
      <DisposalPanelHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-3 text-sm text-gray-600">
            The classifier result is used to pre-fill the disposal form below. You can adjust fields (mode, quantity, center, schedule) before submitting.
          </div>
          <DisposalRequestForm
            initial={{
              wasteType: classification?.suggestedWasteType || classification?.label || "",
              category: classification?.category
                ? ["electronic", "ewaste", "battery", "chemical"].some((k) => String(classification.category).toLowerCase().includes(k))
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

        <div>
          <div className="h-64 mb-3">
            <DisposalMap centers={centers} userCoords={userCoords} defaultCenter={defaultCenter} bounds={mapBounds} />
          </div>
          <DisposalCentersList nearestCenters={nearestCenters} centers={centers} />
        </div>
      </div>
    </div>
  );
}
