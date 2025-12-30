import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Award,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

export default function ClassificationsTab({
  classifications,
  isLoading,
  isFetching,
  page,
  hasPrev,
  hasNext,
  onRefresh,
  onPrev,
  onNext,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Waste Classifications</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto" />
            <p className="text-gray-600 mt-2">
              Loading your classifications...
            </p>
          </div>
        ) : !classifications || classifications.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No classifications yet</p>
            <p className="text-sm text-gray-500">
              Start classifying waste to see your history here!
            </p>
          </div>
        ) : (
          <>
            <div
              className={`space-y-4 ${
                isFetching ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {classifications.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.imageUrl}
                    alt="Classified waste"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">
                      {item.category}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {format(new Date(item.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold text-amber-600">
                        +{item.pointsEarned || 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasPrev || isFetching}
                onClick={onPrev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">Page {page}</span>

              <Button
                variant="outline"
                size="sm"
                disabled={!hasNext || isFetching}
                onClick={onNext}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
