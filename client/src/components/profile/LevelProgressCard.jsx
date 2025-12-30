import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

function LevelProgressCard({ userLevel, userEcoPoints, levelProgress }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-primary" />
          <span>Level Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{userEcoPoints.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Eco Points</div>
          <div className="mt-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">{userLevel}</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next level</span>
            <span>{levelProgress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress.percentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            {typeof levelProgress.required === "number"
              ? `${levelProgress.current} / ${levelProgress.required} points`
              : levelProgress.required}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(LevelProgressCard);
