import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Camera, History } from "lucide-react";
import ClassificationHistoryItem from "./ClassificationHistoryItem";

const ClassificationHistory = ({ classifications, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Classification History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-2 text-gray-600">Loading history...</p>
          </div>
        ) : classifications.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No classifications yet</p>
            <p className="text-sm text-gray-500">Upload your first image above to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {classifications.slice(0, 10).map((item) => (
              <ClassificationHistoryItem key={item.id} item={item} />
            ))}
            {classifications.length > 10 && (
              <p className="text-center text-sm text-gray-500 pt-4">
                Showing recent 10 classifications out of {classifications.length} total
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassificationHistory;
