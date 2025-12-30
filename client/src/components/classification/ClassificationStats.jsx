import { Card, CardContent } from "@/components/ui/card";
import { Camera, Award, TrendingUp } from "lucide-react";

const ClassificationStats = ({ totalClassifications, totalPoints }) => {
  const avg = totalClassifications > 0 ? Math.round(totalPoints / totalClassifications) : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalClassifications}</div>
          <div className="text-sm text-gray-600">Total Classifications</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-600">{totalPoints}</div>
          <div className="text-sm text-gray-600">Points Earned</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold text-secondary">{avg}</div>
          <div className="text-sm text-gray-600">Avg Points/Item</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassificationStats;
