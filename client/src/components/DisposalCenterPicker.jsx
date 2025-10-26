import React, { useEffect, useState } from "react";
import * as disposalService from "../services/disposalService";
import { MapPinHouse, Phone, ArrowDownToDot } from "lucide-react";
import {Button} from '../components/ui/button';

/**
 * DisposalCenterPicker
 *
 * Props:
 * - centers (array) optional: pre-fetched centers
 * - value (string) optional: selected center id
 * - onChange (fn) required: (centerId) => void
 * - userCoords (object) optional: { lat, lng } if available
 * - limit (number) optional: number of nearest centers to show in list (default 3)
 *
 * Behavior:
 * - If centers prop is not provided, tries to fetch centers via disposalService.listCenters()
 * - Attempts geolocation if userCoords not provided
 * - Computes distanceKm client-side when lat/lng are available
 */
export default function DisposalCenterPicker({
  centers: propCenters = null,
  value = "",
  onChange,
  userCoords = null,
  limit = 3,
}) {
  const [centers, setCenters] = useState(propCenters || []);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(userCoords);
  const [error, setError] = useState(null);

  // Haversine distance (km)
  const haversineKm = (lat1, lon1, lat2, lon2) => {
    if ([lat1, lon1, lat2, lon2].some((v) => v == null)) return null;
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

  // If parent updates propCenters, use them
  useEffect(() => {
    if (propCenters && propCenters.length) {
      setCenters(propCenters);
    }
  }, [propCenters]);

  // Try to get geolocation if parent didn't provide coords
  useEffect(() => {
    if (coords || typeof navigator === "undefined" || !navigator.geolocation)
      return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null),
      { timeout: 5000 }
    );
  }, [coords]);

  // Fetch centers if not provided
  useEffect(() => {
    let mounted = true;
    async function fetchCenters() {
      if (propCenters && propCenters.length) return;
      setLoading(true);
      try {
        // request many centers; parent/filter/nearest will slice
        const res = await disposalService.listCenters({
          limit: 50,
          lat: coords?.lat,
          lng: coords?.lng,
        });
        const list = res && res.centers ? res.centers : [];
        if (!mounted) return;
        setCenters(list);
      } catch (err) {
        console.error("DisposalCenterPicker: failed to fetch centers", err);
        if (mounted) setError("Failed to load centers");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCenters();
    return () => {
      mounted = false;
    };
  }, [propCenters, coords]);

  // Enrich centers with computed distanceKm when coords available
  const enriched = centers.map((c) => {
    const clat = c.lat != null ? Number(c.lat) : null;
    const clng = c.lng != null ? Number(c.lng) : null;
    const distanceKm =
      coords && clat != null && clng != null
        ? haversineKm(coords.lat, coords.lng, clat, clng)
        : c.distanceKm ?? null;
    return { ...c, distanceKm };
  });

  // Sorted: by distance when available, else fallback to original order
  const sorted = enriched.slice().sort((a, b) => {
    if (a.distanceKm == null && b.distanceKm == null) return 0;
    if (a.distanceKm == null) return 1;
    if (b.distanceKm == null) return -1;
    return a.distanceKm - b.distanceKm;
  });

  const nearest = sorted.slice(0, limit);

  const handleSelect = (e) => {
    onChange && onChange(e.target.value);
  };

  return (
    <div>
      <div>
        <select
          value={value || ""}
          onChange={handleSelect}
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="">-- No preference --</option>
          {sorted.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.name}
              {c.area ? ` — ${c.area}` : ""}
              {c.distanceKm != null ? ` — ${c.distanceKm.toFixed(2)} km` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 text-sm text-gray-700 space-y-2">
        {loading && (
          <div className="text-sm text-gray-500">Loading centers...</div>
        )}
        {error && <div className="text-sm text-red-500">{error}</div>}

        {nearest.length > 0
          ? nearest.map((c) => (
              <div
                key={c._id || c.id}
                className="p-2 border rounded flex items-start justify-between"
              >
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="flex mb-1">
                    <MapPinHouse className="h-4 w-4" />
                    {c.address && (
                      <div className="mx-2 text-xs text-gray-600">
                        {c.address}
                      </div>
                    )}
                  </div>
                  <div className="flex mb-1">
                    <Phone className="h-4 w-4" />
                    {c.contact && (
                      <div className="mx-2 text-xs text-gray-500 mt-1">
                        Phone: {c.contact}
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    <ArrowDownToDot className="h-4 w-4" />
                    {c.distanceKm != null && (
                      <div className="mx-2 text-xs text-gray-500 mt-1">
                        ~{c.distanceKm.toFixed(2)} km
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onChange && onChange(c._id || c.id)}
                    className="text-sm px-3 py-1 h-8 border rounded"
                  >
                    Select
                  </Button>
                  {c.lat && c.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${c.lat},${c.lng}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary mt-2"
                    >
                      Map
                    </a>
                  )}
                </div>
              </div>
            ))
          : !loading && (
              <div className="text-sm text-gray-500">No centers found.</div>
            )}
      </div>
    </div>
  );
}
