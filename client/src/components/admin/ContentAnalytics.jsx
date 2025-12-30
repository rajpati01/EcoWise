import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Users, TrendingUp, Activity as ActivityIcon } from "lucide-react";

export default function ContentAnalytics({ contentAnalytics, ecoPointsAnalytics, COLORS }) {
  return (
    <div className="space-y-6">
      {/* First Row: Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Blogs by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentAnalytics.blogsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentAnalytics.blogsByStatus.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentAnalytics.campaignsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentAnalytics.campaignsByStatus.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: New Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eco Points by Activity Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Eco Points by Activity Type
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {ecoPointsAnalytics.ecoPointsByActivity?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ecoPointsAnalytics.ecoPointsByActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="activity" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="points"
                    name="Total Points"
                    fill="#10b981"
                  />
                  <Bar
                    dataKey="count"
                    name="Activity Count"
                    fill="#3b82f6"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No activity data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Engaged Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Most Engaged Users
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {ecoPointsAnalytics.engagementInsights?.topEngagedUsers?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={ecoPointsAnalytics.engagementInsights.topEngagedUsers}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="username" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="activities"
                    name="Activities"
                    fill="#8b5cf6"
                  />
                  <Bar
                    dataKey="points"
                    name="Points Earned"
                    fill="#f59e0b"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No engagement data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Engagement Stats Cards */}
      {ecoPointsAnalytics.engagementInsights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Activities
                  </p>
                  <h3 className="text-2xl font-bold">
                    {ecoPointsAnalytics.engagementInsights.totalActivities?.toLocaleString() || 0}
                  </h3>
                </div>
                <ActivityIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Users
                  </p>
                  <h3 className="text-2xl font-bold">
                    {ecoPointsAnalytics.engagementInsights.uniqueActiveUsers?.toLocaleString() || 0}
                  </h3>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Activities/User
                  </p>
                  <h3 className="text-2xl font-bold">
                    {ecoPointsAnalytics.engagementInsights.avgActivitiesPerUser || 0}
                  </h3>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}