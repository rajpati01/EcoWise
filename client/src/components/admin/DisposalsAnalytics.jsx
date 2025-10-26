import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
  LineChart,
  Line,
} from "recharts";

export default function DisposalsAnalytics({ disposalAnalytics, COLORS }) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Counts by status - small cards */}
        <div className="lg:col-span-1 grid gap-3">
          {disposalAnalytics.countsByStatus.map((s) => (
            <Card key={s.status}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 capitalize">
                      {s.status}
                    </div>
                    <div className="text-2xl font-semibold">
                      {s.count ?? 0}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">requests</div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent>
              <div className="text-sm text-gray-500">
                Completion Rate
              </div>
              <div className="text-2xl font-semibold">
                {disposalAnalytics.completedRate ?? 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Percentage of requests that were completed
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status distribution pie */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disposalAnalytics.countsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="count"
                  nameKey="status"
                >
                  {disposalAnalytics.countsByStatus.map(
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

        {/* Top centers bar chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Requests by Center (top 5)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disposalAnalytics.byCenter.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly totals trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Disposal Requests</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={disposalAnalytics.monthlyTotals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                name="Requests"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}