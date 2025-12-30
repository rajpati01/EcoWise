const DisposalCentersList = ({ title = "Nearby Disposal Centers", nearestCenters = [], centers = [] }) => {
  const hasNearest = nearestCenters && nearestCenters.length > 0;
  const list = hasNearest ? nearestCenters : centers.slice(0, 3);

  return (
    <aside className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="text-sm text-gray-700 space-y-2">
        {list && list.length > 0 ? (
          list.map((c) => (
            <div key={c._id || c.id} className="p-2 border rounded">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-600">{c.address}</div>
              {c.distanceKm != null && (
                <div className="text-xs mt-1">~{c.distanceKm.toFixed(2)} km</div>
              )}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No centers available.</div>
        )}
      </div>
    </aside>
  );
};

export default DisposalCentersList;
