import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/utils/profileHelpers";

export default function BlogsTab({ 
  blogs, 
  isLoading,
  isFetching,
  page,
  hasPrev,
  hasNext,
  onRefresh,
  onPrev,
  onNext,
}) {
  // Safety check to ensure blogs is an array
  const safeBLogs = Array.isArray(blogs) ? blogs : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Articles</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto" />
            <p className="text-gray-600 mt-2">Loading your articles...</p>
          </div>
        ) : safeBLogs.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No articles yet</p>
            <p className="text-sm text-gray-500">Write your first article to share your knowledge!</p>
          </div>
        ) : (
          <>
            <div className={`space-y-4 ${isFetching ? 'opacity-50 pointer-events-none' : ''}`}>
              {safeBLogs.map((blog) => (
                <div key={blog._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{blog.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blog.excerpt || blog.content?.substring(0, 150)}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Badge className={getStatusColor(blog.status)}>{blog.status}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!hasPrev || isFetching} 
                onClick={onPrev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Page {page}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!hasNext || isFetching} 
                onClick={onNext}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}