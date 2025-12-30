import React, { useState, useEffect, useContext } from "react";
import * as disposalService from "../services/disposalService";
import { AuthContext } from "../context/AuthContext";
import DisposalCenterPicker from "./DisposalCenterPicker";
import { useToast } from "../hooks/use-toast"; 
import { Button } from "./ui/button";

/**
 * DisposalRequestForm (updated)
 * Props:
 * - authToken (string) optional
 * - onCreated (fn) optional
 * - initial (object) optional
 * - centers (array) optional: if provided, used for Preferred center select (no fetch)
 * - initialCenterId (string) optional: center id to preselect
 */
export default function DisposalRequestForm({
  authToken = null,
  onCreated = () => {},
  initial = {},
  centers: externalCenters = null,
  initialCenterId = "",
  userCoords = null,
}) {
  const authCtx = useContext(AuthContext);
  const token = authToken || authCtx?.token || null;
  const { toast } = useToast();

  const [wasteType, setWasteType] = useState("");
  const [category, setCategory] = useState("recyclable");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [mode, setMode] = useState("pickup"); // pickup | self-deliver
  const [centerId, setCenterId] = useState(initialCenterId || "");
  const [centers, setCenters] = useState(externalCenters || []);
  const [notes, setNotes] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [lastCreated, setLastCreated] = useState(null);

  // compute min local datetime string (YYYY-MM-DDTHH:mm)
  const computeMinLocalDatetime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  };
  const minDatetimeLocal = computeMinLocalDatetime();

  // React to external initial/prefill changes
  useEffect(() => {
    if (!initial) return;
    if (initial.wasteType !== undefined) setWasteType(initial.wasteType || "");
    if (initial.category !== undefined)
      setCategory(initial.category || "recyclable");
    if (initial.quantity !== undefined)
      setQuantity(initial.quantity !== null ? String(initial.quantity) : "");
    if (initial.unit !== undefined) setUnit(initial.unit || "kg");
    if (initial.mode !== undefined) setMode(initial.mode || "pickup");
    if (initial.notes !== undefined) setNotes(initial.notes || "");
    if (initial.scheduledAt !== undefined) {
      const d = initial.scheduledAt ? new Date(initial.scheduledAt) : null;
      if (d) {
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISO = new Date(d.getTime() - tzOffset)
          .toISOString()
          .slice(0, 16);
        setScheduledAt(localISO);
      } else {
        setScheduledAt("");
      }
    }
    // if initial suggests a center preference, respect it
    if (initial.centerId) setCenterId(initial.centerId);
  }, [initial]);

  // If external centers prop changes, use it and set default center
  useEffect(() => {
    if (!externalCenters) return;
    setCenters(externalCenters);
    // if initialCenterId provided, prefer it; else pick first nearest provided
    if (initialCenterId) {
      setCenterId(initialCenterId);
    } else if (externalCenters && externalCenters.length > 0) {
      setCenterId(externalCenters[0]._id || externalCenters[0].id || "");
    }
  }, [externalCenters, initialCenterId]);

  // If no external centers provided, fetch centers (fallback)
  useEffect(() => {
    if (externalCenters && externalCenters.length) return;
    let mounted = true;
    async function fetchCenters() {
      setLoadingCenters(true);
      try {
        const res = await disposalService.listCenters({ limit: 10, category });
        const list = res && res.centers ? res.centers : [];
        if (mounted) {
          setCenters(list);
          if (!centerId && list.length > 0)
            setCenterId(list[0]._id || list[0].id || "");
        }
      } catch (err) {
        console.error("Failed to load centers", err);
        if (mounted) setCenters([]);
      } finally {
        if (mounted) setLoadingCenters(false);
      }
    }
    fetchCenters();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCenters, category]);

  useEffect(() => {
    // If user chooses pickup, clear preferred center since it's not needed
    if (mode === "pickup") {
      setCenterId("");
    }
  }, [mode]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setMessage(null);

    // Client-side validation
    if (!category || !mode) {
      setMessage({ type: "error", text: "Category and mode are required." });
      toast({ title: "Validation error", description: "Category and mode are required.", variant: "destructive" });
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setMessage({ type: "error", text: "Please enter a valid quantity." });
      toast({ title: "Validation error", description: "Please enter a valid quantity.", variant: "destructive" });
      return;
    }

    // If self-deliver require choosing a preferred center
    if (mode === "self-deliver" && !centerId) {
      setMessage({ type: "error", text: "Please select a preferred center for self-delivery." });
      toast({ title: "Validation error", description: "Please select a preferred center for self-delivery.", variant: "destructive" });
      return;
    }

    // validate scheduledAt not in past
    if (scheduledAt) {
      const selected = new Date(scheduledAt);
      const now = new Date();
      if (selected.getTime() < now.getTime() - 1000) {
        setMessage({
          type: "error",
          text: "Scheduled date/time cannot be in the past.",
        });
        toast({ title: "Validation error", description: "Scheduled date/time cannot be in the past.", variant: "destructive" });
        return;
      }
    }

    const payload = {
      wasteType,
      category,
      quantity: Number(quantity),
      unit,
      mode,
      centerId: centerId || null,
      pickupLocation: null,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      notes,
    };

    setSubmitting(true);
    try {
      const res = await disposalService.createRequest(payload, token);
      const created = res?.request || res;
      setLastCreated(created);
      setMessage({ type: "success", text: "Request created successfully." });
      onCreated(created);

      // Toast success with request id & instruction
      const rid = created?.requestId || created?._id || "";
      toast({
        title: "Request created",
        description: rid
          ? `Request ID: ${rid}. Give this ID to the collector when you hand over items.`
          : "Request created successfully.",
      });

      // Optionally clear some fields
      setWasteType("");
      setQuantity("");
      setNotes("");

      // keep center selection (so user can easily create another request)
    } catch (err) {
      console.error("Create request failed", err);
      const text =
        err?.body?.message || err.message || "Failed to create request";
      setMessage({ type: "error", text });
      toast({
        title: "Failed to create request",
        description: text,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-3">Request Disposal</h3>
      {message && (
        <div
          className={`mb-3 p-2 rounded ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-800"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm text-gray-600">
            Waste description (optional)
          </label>
          <input
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            placeholder="e.g., Old laptop"
            className="w-full mt-1 p-2 border rounded"
            disabled={submitting}
          />
        </div>

        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <label className="block text-sm text-gray-600">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              disabled={submitting}
            >
              <option value="recyclable">Recyclable</option>
              <option value="non-recyclable">Non-recyclable</option>
              <option value="Biodegradable">Biodegradable</option>
              <option value="hazardous">Hazardous</option>
            </select>
          </div>

          <div style={{ width: 120 }}>
            <label className="block text-sm text-gray-600">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              min="0"
              step="0.1"
              disabled={submitting}
            />
          </div>

          <div style={{ width: 110 }}>
            <label className="block text-sm text-gray-600">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              disabled={submitting}
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
            </select>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm text-gray-600">Mode</label>
          <div className="flex gap-4 mt-1">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={mode === "pickup"}
                onChange={() => setMode("pickup")}
                disabled={submitting}
              />
              <span className="text-sm">Pickup</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={mode === "self-deliver"}
                onChange={() => setMode("self-deliver")}
                disabled={submitting}
              />
              <span className="text-sm">Self-deliver</span>
            </label>
          </div>
        </div>

        {/* Preferred center - only show for self-deliver mode */}
        {mode === "self-deliver" && (
          <div className="mb-2">
            <label className="block text-sm text-gray-600">
              Preferred center (required)
            </label>
            <DisposalCenterPicker
              centers={centers}
              value={centerId}
              onChange={(id) => setCenterId(id)}
              userCoords={userCoords}
              limit={3}
            />
          </div>
        )}

        <div className="mb-2">
          <label className="block text-sm text-gray-600">
            Schedule (optional)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            min={minDatetimeLocal}
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            rows={3}
            disabled={submitting}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${submitting ? "bg-gray-400" : "bg-primary"}`}
          >
            {submitting ? "Submitting..." : "Create request"}
          </button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setWasteType("");
              setCategory("recyclable");
              setQuantity("");
              setUnit("kg");
              setMode("pickup");
              setCenterId("");
              setNotes("");
              setScheduledAt("");
              setMessage(null);
            }}
            className="px-3 py-2 border rounded"
            disabled={submitting}
          >
            Reset
          </Button>
        </div>
      </form>

      {lastCreated && (
        <div className="mt-3 p-4 bg-emerald-50 rounded-md border border-emerald-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-600">Request created</div>
              <div className="text-lg font-semibold text-gray-900">
                {lastCreated.requestId || lastCreated._id || "—"}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {lastCreated.wasteType || lastCreated.category || ""}
              </div>

              {/* Instruction for user */}
              <div className="mt-2 text-sm text-gray-700">
                Give the request ID above to the collector or drop-off attendant when handing over items.
              </div>
            </div>

            <div className="text-right text-sm text-gray-700">
              <div>
                Status:{" "}
                <span className="font-medium">
                  {(lastCreated.status || "pending").toString()}
                </span>
              </div>
              {lastCreated.pointsAwarded != null && (
                <div className="mt-1 text-amber-600 font-semibold">
                  +{lastCreated.pointsAwarded} EcoPoints
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
            <div>
              <div className="text-xs text-gray-500">Category</div>
              <div className="font-medium">{lastCreated.category || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Quantity</div>
              <div className="font-medium">
                {lastCreated.quantity ?? lastCreated.verifiedQuantity ?? "—"}{" "}
                {lastCreated.unit || "kg"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Preferred center</div>
              <div className="font-medium">
                {typeof lastCreated.centerId === "object"
                  ? lastCreated.centerId.name
                  : lastCreated.centerName ||
                    lastCreated.centerId ||
                    "No preference"}
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="text-xs text-gray-500">Scheduled</div>
              <div className="font-medium">
                {lastCreated.scheduledAt
                  ? new Date(lastCreated.scheduledAt).toLocaleString()
                  : "Not scheduled"}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <a
              href={`/profile/requests/${lastCreated._id || lastCreated.requestId}`}
              className="text-sm text-primary underline"
            >
              View request
            </a>

            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(
                  lastCreated.requestId || lastCreated._id || ""
                )
              }
              className="text-sm px-3 py-1 border rounded"
            >
              Copy ID
            </button>

            {lastCreated.centerId && (
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  typeof lastCreated.centerId === "object"
                    ? `${lastCreated.centerId.lat},${lastCreated.centerId.lng}`
                    : ""
                )}`}
                className="ml-auto text-sm text-primary underline"
              >
                Open map
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}