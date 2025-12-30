import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, MapPin } from "lucide-react";

const CampaignStats = memo(({ stats }) => {
  return (
    <section aria-label="Campaign statistics">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-secondary mx-auto mb-2" aria-hidden="true" />
            <div className="text-2xl font-bold text-secondary">{stats.totalParticipants}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" aria-hidden="true" />
            <div className="text-2xl font-bold text-accent">{stats.upcoming}</div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" aria-hidden="true" />
            <div className="text-2xl font-bold text-green-600">{stats.locations}</div>
            <div className="text-sm text-gray-600">Locations</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

export default CampaignStats;
