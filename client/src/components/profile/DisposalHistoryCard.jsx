import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/utils/profileHelpers";

export default function DisposalHistoryCard({
  disposalRequests,
  isLoading,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Disposal Requests</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto" />
            <p className="text-gray-600 mt-2">Loading your requests...</p>
          </div>
        ) : !disposalRequests || disposalRequests.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">You have not created any disposal requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disposalRequests.map((req) => (
              <div key={req._id || req.requestId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {req.wasteType || req.category || "Disposal Request"}
                      </h3>
                      <p className="mx-2 text-sm text-gray-500">
                        {format(new Date(req.createdAt || Date.now()), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{req.notes || "No notes"}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <div>
                        Request ID: <span className="font-mono text-xs">{req.requestId || req._id}</span>
                      </div>
                      <div>
                        Preferred center:{" "}
                        {req.centerName ||
                          (req.centerId && typeof req.centerId === "object"
                            ? req.centerId.name || req.centerId._id || "No preference"
                            : req.centerId) ||
                          "No preference"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                    </div>
                    {req.pointsAwarded != null && (
                      <div className="mt-4 mx-3 flex items-center space-x-1">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span className="font-semibold text-amber-600">+{req.pointsAwarded}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={onPrevPage}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="mx-4 self-center">
                Page {currentPage} / {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={onNextPage}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
