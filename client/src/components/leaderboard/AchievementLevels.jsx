import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const LEVELS = [
  { level: "Beginner", points: "0-49", color: "bg-gray-500" },
  { level: "Eco Explorer", points: "50-199", color: "bg-yellow-500" },
  { level: "Eco Warrior", points: "200-499", color: "bg-green-500" },
  { level: "Eco Champion", points: "500-999", color: "bg-blue-500" },
  { level: "Eco Master", points: "1000+", color: "bg-purple-500" },
];

export default function AchievementLevels() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Levels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {LEVELS.map((a) => (
          <div key={a.level} className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${a.color}`} />
            <div className="flex-1">
              <div className="font-medium text-sm">{a.level}</div>
              <div className="text-xs text-gray-600">{a.points} points</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
