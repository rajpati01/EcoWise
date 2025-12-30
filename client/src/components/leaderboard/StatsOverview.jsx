import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Award, TrendingUp } from "lucide-react";

export default function StatsOverview({ leaderboard }) {
  const topScore = Number(leaderboard?.[0]?.ecoPoints || 0);
  const totalUsers = leaderboard?.length
    ? Math.max(...leaderboard.map((u) => Number(u.rank || 0)))
    : 0;
  const averageScore = leaderboard?.length
    ? Math.round(leaderboard.reduce((sum, u) => sum + Number(u.ecoPoints || 0), 0) / leaderboard.length)
    : 0;
  const ecoMasters = leaderboard?.filter((u) => u.level === "Eco Master").length || 0;

  const items = [
    { icon: Trophy, label: "Top Score", value: topScore.toLocaleString(), color: "text-gray-900", iconColor: "text-amber-500" },
    { icon: Users, label: "Total Users", value: totalUsers, color: "text-primary", iconColor: "text-primary" },
    { icon: Award, label: "Average Score", value: averageScore, color: "text-secondary", iconColor: "text-secondary" },
    { icon: TrendingUp, label: "Eco Masters", value: ecoMasters, color: "text-accent", iconColor: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map(({ icon: Icon, label, value, color, iconColor }) => (
        <Card key={label}>
          <CardContent className="p-6 text-center">
            <Icon className={`h-8 w-8 ${iconColor} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
