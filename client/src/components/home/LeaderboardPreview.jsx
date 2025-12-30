import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Award, Users, Star, Calendar } from "lucide-react";

function PodiumCard({ place, user, getUserLevel }) {
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
          {user.level || getUserLevel(user.ecoPoints)}
        </Badge>
        <div className={`font-bold ${isFirst ? "text-2xl" : "text-xl"} ${pointsClass}`}>
          {Number(user.ecoPoints || 0).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">points</div>
      </CardContent>
    </Card>
  );
}

const ACHIEVEMENTS = [
  { icon: Star, name: "First Classification", unlocked: true },
  { icon: Award, name: "100 Points", unlocked: true },
  { icon: Trophy, name: "500 Points", unlocked: false },
  { icon: Users, name: "Team Player", unlocked: true },
  { icon: Calendar, name: "7 Day Streak", unlocked: false },
  { icon: Award, name: "Eco Master", unlocked: false },
];

export default function LeaderboardPreview({ leaderboard, getUserLevel }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Community Leaderboard</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how you rank among our eco-warriors. Compete with friends and earn recognition for your environmental efforts.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <PodiumCard place={2} user={leaderboard?.[1]} getUserLevel={getUserLevel} />
              <PodiumCard place={1} user={leaderboard?.[0]} getUserLevel={getUserLevel} />
              <PodiumCard place={3} user={leaderboard?.[2]} getUserLevel={getUserLevel} />

              {/* View Full Leaderboard Button */}
              <div className="text-center pt-4 col-span-3 flex justify-center">
                <Link href="/leaderboard">
                  <Button className="bg-accent hover:bg-accent/90">View Full Leaderboard</Button>
                </Link>
              </div>
            </div>

            {/* Achievement Showcase */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 text-center lg:text-left">Earn Achievements</h3>

              {/* Badge Grid */}
              <div className="grid grid-cols-3 gap-4">
                {ACHIEVEMENTS.map((badge) => (
                  <Card key={badge.name} className={`text-center p-4 ${badge.unlocked ? "bg-white" : "bg-gray-100 opacity-50"}`}>
                    <CardContent className="p-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          badge.unlocked ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <badge.icon className={`h-6 w-6 ${badge.unlocked ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <p className={`text-xs font-medium ${badge.unlocked ? "text-gray-700" : "text-gray-500"}`}>{badge.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Progress Bar */}
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Next Level Progress</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500" style={{ width: "75%" }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">150 / 200 points to Eco Champion</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}