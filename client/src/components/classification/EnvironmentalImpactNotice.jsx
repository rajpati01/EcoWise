import { AlertCircle } from "lucide-react";

const EnvironmentalImpactNotice = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div className="text-sm text-blue-800">
        <p className="font-medium mb-1">Environmental Impact</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default EnvironmentalImpactNotice;
