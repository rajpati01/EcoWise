import React from "react";

const DashboardCard = ({ title, value, icon, color, percentage }) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-700';
      case 'green': return 'bg-green-50 text-green-700';
      case 'red': return 'bg-red-50 text-red-700';
      case 'purple': return 'bg-purple-50 text-purple-700';
      case 'yellow': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getIconColorClass = () => {
    switch (color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'red': return 'text-red-500';
      case 'purple': return 'text-purple-500';
      case 'yellow': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getColorClass()}`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {percentage !== undefined && (
            <p className="text-xs mt-1">
              {percentage}% of total
            </p>
          )}
        </div>
        <div className={`rounded-full p-2 ${getIconColorClass()} bg-opacity-20`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;