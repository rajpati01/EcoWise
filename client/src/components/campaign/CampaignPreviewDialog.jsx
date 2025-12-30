import { memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin, Users, User as UserIcon } from "lucide-react";
import { getStatusBadge } from "@/utils/statusHelpers";
import {
  formatCampaignDate,
  getCampaignTimingStatus,
} from "@/utils/campaignHelpers";

// Constants
const MAX_CONTENT_HEIGHT = "max-h-96";
const IMAGE_MAX_HEIGHT = "max-h-60";

const CampaignPreviewDialog = memo(({ open, onOpenChange, campaign }) => {
  // Memoize computed values
  const formattedStartDate = useMemo(
    () => (campaign?.startDate ? formatCampaignDate(campaign.startDate) : ""),
    [campaign?.startDate]
  );

  const formattedEndDate = useMemo(
    () => (campaign?.endDate ? formatCampaignDate(campaign.endDate) : ""),
    [campaign?.endDate]
  );

  const formattedCreatedAt = useMemo(
    () => (campaign?.createdAt ? formatCampaignDate(campaign.createdAt) : ""),
    [campaign?.createdAt]
  );

  const timingStatus = useMemo(
    () =>
      campaign?.startDate && campaign?.endDate
        ? getCampaignTimingStatus(campaign.startDate, campaign.endDate)
        : { isUpcoming: false, isActive: false, isEnded: false },
    [campaign?.startDate, campaign?.endDate]
  );

  // Early return if no campaign data
  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl"
        aria-describedby="campaign-preview-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
            {campaign.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className={MAX_CONTENT_HEIGHT}>
          <div className="space-y-4" id="campaign-preview-description">
            {/* Organizer and Status */}
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserIcon className="h-4 w-4" aria-hidden="true" />
                <span>
                  Organized by{" "}
                  <strong className="text-gray-900">
                    {campaign.authorName || "Unknown"}
                  </strong>
                </span>
              </div>
              {campaign.status && getStatusBadge(campaign.status)}
            </div>

            {/* Campaign Image */}
            {campaign.imageUrl && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={campaign.imageUrl}
                  alt={`Campaign image for ${campaign.title}`}
                  className={`w-full ${IMAGE_MAX_HEIGHT} object-cover`}
                  loading="lazy"
                />
              </div>
            )}

            {/* Description */}
            {campaign.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  About this Campaign
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {campaign.description}
                </p>
              </div>
            )}

            {/* Campaign Details */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-gray-900">Details</h3>

              {campaign.location && (
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="text-gray-600 ml-1">{campaign.location}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <div className="text-gray-600 ml-1">
                    <time dateTime={campaign.startDate}>
                      Start: {formattedStartDate}
                    </time>
                    <br />
                    <time dateTime={campaign.endDate}>
                      End: {formattedEndDate}
                    </time>
                  </div>
                </div>
              </div>

              {campaign.participantCount !== undefined && (
                <div className="flex items-start space-x-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Participants:
                    </span>
                    <span className="text-gray-600 ml-1">
                      {campaign.participantCount}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Timing Status */}
            <div className="flex items-center space-x-2 pt-2">
              {timingStatus.isUpcoming && (
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-200"
                >
                  Upcoming
                </Badge>
              )}
              {timingStatus.isActive && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Active Now
                </Badge>
              )}
              {timingStatus.isEnded && (
                <Badge variant="secondary">Completed</Badge>
              )}
            </div>

            {/* Created Date */}
            {formattedCreatedAt && (
              <div className="text-xs text-gray-400 pt-3 border-t">
                Created on:{" "}
                <time dateTime={campaign.createdAt}>{formattedCreatedAt}</time>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

export default CampaignPreviewDialog;