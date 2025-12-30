import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Award } from "lucide-react";

function PodiumCard({ place, user }) {
  if (!user) return null;
  const isFirst = place === 1;
  const isSecond = place === 2;
  const bgClasses = isFirst
    ? "from-amber-100 to-amber-200 scale-105 z-10"
    : isSecond
    ? "from-gray-100 to-gray-200"
    : "from-amber-50 to-amber-100";
  const Icon = isFirst ? Crown : isSecond ? Trophy : Award;
  const pointsClass = isFirst ? "text-amber-700" : isSecond ? "text-gray-700" : "text-amber-700";
  const badgeClass = isFirst ? "bg-amber-600" : undefined;

  return (
    <Card className={`bg-gradient-to-br ${bgClasses}`}>
      <CardContent className="p-6 text-center">
        <div
          className={`$${isFirst ? "w-20 h-20" : "w-16 h-16"} bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-4 ${
            isFirst ? "from-amber-400 to-amber-600" : isSecond ? "from-gray-400 to-gray-600" : "from-amber-600 to-amber-800"
          }`}
        >
          <Icon className={isFirst ? "h-10 w-10 text-white" : "h-8 w-8 text-white"} />
        </div>
        <h3 className="font-bold text-gray-900 truncate">{user.username}</h3>
        <Badge variant={isFirst ? undefined : "secondary"} className={badgeClass ? `${badgeClass} mb-2` : "mb-2"}>
          {user.level}
        </Badge>
        <div className={`font-bold ${isFirst ? "text-2xl" : "text-xl"} ${pointsClass}`}>
          {Number(user.ecoPoints || 0).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">points</div>
      </CardContent>
    </Card>
  );
}

export default function Podium({ leaderboard }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <PodiumCard place={2} user={leaderboard?.[1]} />
      <PodiumCard place={1} user={leaderboard?.[0]} />
      <PodiumCard place={3} user={leaderboard?.[2]} />
    </div>
  );
}