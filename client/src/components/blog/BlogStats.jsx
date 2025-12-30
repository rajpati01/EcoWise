import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PenTool, TrendingUp } from "lucide-react";

const BlogStats = memo(({ stats }) => {
  return (
    <section aria-label="Blog statistics">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Published Articles</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <PenTool className="h-8 w-8 text-secondary mx-auto mb-2" aria-hidden="true" />
            <div className="text-2xl font-bold text-secondary">
              {stats.contributors}
            </div>
            <div className="text-sm text-gray-600">Contributors</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" aria-hidden="true" />
            <div className="text-2xl font-bold text-accent">{stats.thisWeek}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

export default BlogStats;
