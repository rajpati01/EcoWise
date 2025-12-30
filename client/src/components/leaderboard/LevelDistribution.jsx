import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LevelDistribution({ leaderboard }) {
  const levelCounts = (leaderboard || []).reduce((acc, u) => {
    const level = u.level || "Unknown";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  const total = leaderboard?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Level Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(levelCounts).map(([level, count]) => (
          <div key={level} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{level}</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
              </div>
              <span className="text-sm text-gray-600">{count}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
