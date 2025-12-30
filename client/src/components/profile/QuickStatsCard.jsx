import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Camera, BookOpen, Users } from "lucide-react";

function QuickStatsCard({ thisWeekCount, blogsCount, campaignsCount }) {
  const stats = [
    { icon: Camera, label: "This Week", value: thisWeekCount },
    { icon: BookOpen, label: "Articles", value: blogsCount },
    { icon: Users, label: "Campaigns", value: campaignsCount },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{label}</span>
            </div>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default memo(QuickStatsCard);
