import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/utils/profileHelpers";

export default function JoinedCampaignsCard({
  joinedCampaigns,
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
          <CardTitle>Joined Campaigns</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto" />
            <p className="text-gray-600 mt-2">Loading your campaigns...</p>
          </div>
        ) : !joinedCampaigns || joinedCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">You have not joined any campaigns yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {joinedCampaigns.map((campaign) => (
              <div key={campaign._id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{campaign.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <MapPin className="h-4 w-4 mr-1"/>
                      <span>{campaign.location}</span>
                      <Users className="h-4 w-4 mr-1"/>
                      <span>{campaign.participantCount} participants</span>
                      <Calendar className="h-4 w-4 mr-1"/>
                      <span>{format(new Date(campaign.startDate), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
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