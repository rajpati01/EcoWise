import { useState, useMemo, memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignService } from "@/services/campaignService";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getStatusBadge } from "@/utils/statusHelpers";
import {
  getCampaignTimingStatus,
  hasUserJoinedCampaign,
  formatCampaignDateRange,
} from "@/utils/campaignHelpers";
import { Calendar, MapPin, Users, User } from "lucide-react";

// Constants
const IMAGE_HEIGHT_CLASS = "h-48";
const DESCRIPTION_LINE_CLAMP = "line-clamp-3";
const JOIN_CAMPAIGN_POINTS = 10;

const CampaignCard = memo(({ campaign, showStatus = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [justJoined, setJustJoined] = useState(false);

  // Memoize computed values
  const hasJoined = useMemo(
    () => justJoined || hasUserJoinedCampaign(campaign, user),
    [justJoined, campaign.participants, user?._id]
  );

  const timingStatus = useMemo(
    () => getCampaignTimingStatus(campaign.startDate, campaign.endDate),
    [campaign.startDate, campaign.endDate]
  );

  const dateRange = useMemo(
    () => formatCampaignDateRange(campaign.startDate, campaign.endDate),
    [campaign.startDate, campaign.endDate]
  );

  const joinMutation = useMutation({
    mutationFn: () => campaignService.joinCampaign(campaign._id),
    onSuccess: () => {
      setJustJoined(true);
      toast({
        title: "Joined Campaign!",
        description: `You've successfully joined this campaign and earned ${JOIN_CAMPAIGN_POINTS} eco points!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Join",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const canJoin =
    campaign.status === "approved" &&
    isAuthenticated &&
    !timingStatus.isEnded;

  return (
    <Card
      className="hover-lift"
      role="article"
      aria-label={`Campaign: ${campaign.title}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
            {campaign.title}
          </CardTitle>
          {showStatus && getStatusBadge(campaign.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Campaign Image */}
        {campaign.imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={campaign.imageUrl}
              alt={`Campaign image for ${campaign.title}`}
              className={`w-full ${IMAGE_HEIGHT_CLASS} object-cover`}
              loading="lazy"
            />
          </div>
        )}

        {/* Description */}
        {campaign.description && (
          <p
            className={`text-gray-600 leading-relaxed ${DESCRIPTION_LINE_CLAMP}`}
          >
            {campaign.description}
          </p>
        )}

        {/* Details */}
        <div
          className="space-y-2"
          role="list"
          aria-label="Campaign details"
        >
          {campaign.location && (
            <div
              className="flex items-center space-x-2 text-sm text-gray-600"
              role="listitem"
            >
              <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <span>{campaign.location}</span>
            </div>
          )}

          <div
            className="flex items-center space-x-2 text-sm text-gray-600"
            role="listitem"
          >
            <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <time dateTime={campaign.startDate}>{dateRange}</time>
          </div>

          <div
            className="flex items-center space-x-2 text-sm text-gray-600"
            role="listitem"
          >
            <Users className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <span>{campaign.participantCount || 0} participants</span>
          </div>
        </div>

        {/* Timing Status Badges */}
        <div
          className="flex items-center space-x-2"
          role="status"
          aria-live="polite"
        >
          {timingStatus.isUpcoming && (
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Upcoming
            </Badge>
          )}
          {timingStatus.isActive && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              Active Now
            </Badge>
          )}
          {timingStatus.isEnded && <Badge variant="secondary">Completed</Badge>}
        </div>

        {/* Action Button */}
        {canJoin && (
          <Button
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending || hasJoined}
            className="w-full"
            aria-label={
              hasJoined
                ? "Already joined campaign"
                : "Join this campaign"
            }
          >
            {hasJoined ? (
              <>
                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                Joined
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                {joinMutation.isPending ? "Joining..." : "Join Campaign"}
              </>
            )}
          </Button>
        )}

        {!isAuthenticated && (
          <p
            className="text-sm text-gray-500 text-center py-2"
            role="status"
          >
            Login to join campaigns
          </p>
        )}
      </CardContent>
    </Card>
  );
});

export default CampaignCard;
