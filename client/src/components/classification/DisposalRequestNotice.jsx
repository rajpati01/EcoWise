const DisposalRequestNotice = ({ requestId }) => {
  if (!requestId) return null;
  return (
    <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-md">
      Request created: <strong>{requestId}</strong>
    </div>
  );
};

export default DisposalRequestNotice;
