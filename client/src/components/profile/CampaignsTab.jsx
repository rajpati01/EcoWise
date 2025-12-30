import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, ChevronRight, RefreshCw, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/utils/profileHelpers";

export default function CampaignsTab({ 
  campaigns,
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
          <CardTitle>My Campaigns</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto" />
            <p className="text-gray-600 mt-2">Loading your campaigns...</p>
          </div>
        ) : !campaigns || campaigns.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No campaigns created yet</p>
            <p className="text-sm text-gray-500">
              Create your first campaign to bring your community together!
            </p>
          </div>
        ) : (
          <>
            <div className={`space-y-4 ${isFetching ? 'opacity-50 pointer-events-none' : ''}`}>
              {campaigns.map((campaign) => (
                <div key={campaign._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {campaign.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4 mr-1" />
                          {campaign.participantCount || campaign.participants?.length || 0} participants
                        </span>
                        <MapPin className="h-4 w-4 mr-1"/>
                        <span>  {campaign.location}</span>
                        <Calendar className="h-4 w-4 mr-1"/>
                        <span>
                           {format(new Date(campaign.startDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
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
              
              <span className="text-sm text-muted-foreground">
                Page {page}
              </span>
              
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