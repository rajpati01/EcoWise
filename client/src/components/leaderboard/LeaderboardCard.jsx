import { memo, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { getUserInitial } from "@/utils/userHelpers";

const RANK_BG = {
  1: "from-yellow-400 to-yellow-600",
  2: "from-gray-300 to-gray-500",
  3: "from-amber-400 to-amber-600",
  default: "from-gray-400 to-gray-600",
};

const LEVEL_BADGE = {
  "Eco Master": "bg-purple-100 text-purple-800",
  "Eco Champion": "bg-blue-100 text-blue-800",
  "Eco Warrior": "bg-green-100 text-green-800",
  "Eco Explorer": "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800",
};

function RankIcon({ position }) {
  if (position === 1) return <Trophy aria-hidden className="h-5 w-5 text-yellow-500" />;
  if (position === 2) return <Medal aria-hidden className="h-5 w-5 text-gray-400" />;
  if (position === 3) return <Award aria-hidden className="h-5 w-5 text-amber-600" />;
  return <span className="text-lg font-bold text-white">#{position}</span>;
}

function LeaderboardCard({ user, rank, showRank = true }) {
  const username = user?.username || "User";
  const ecoPoints = Number(user?.ecoPoints || 0);
  const level = user?.level || "Beginner";

  const rankBg = RANK_BG[rank] || RANK_BG.default;
  const levelClass = LEVEL_BADGE[level] || LEVEL_BADGE.default;
  const initial = useMemo(() => getUserInitial(username), [username]);

  return (
    <Card className={`hover:shadow-md transition-shadow ${rank <= 3 ? "ring-2 ring-primary/20" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {showRank && (
            <div
              className={`w-12 h-12 bg-gradient-to-br ${rankBg} rounded-full flex items-center justify-center flex-shrink-0`}
              aria-label={`Rank ${rank}`}
            >
              <RankIcon position={rank} />
            </div>
          )}

          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profileImage} alt={`${username} avatar`} loading="lazy" />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{username}</h4>
            <Badge variant="secondary" className={levelClass} aria-label={`Level ${level}`}>
              {level}
            </Badge>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-primary">{ecoPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-600">points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(LeaderboardCard);
