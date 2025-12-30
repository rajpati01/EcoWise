import { useState, useEffect, useMemo, memo } from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blogService";

const CommentList = ({ blogId }) => {
  const [page, setPage] = useState(1);

  // Reset to first page when switching blog
  useEffect(() => setPage(1), [blogId]);

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/blogs/${blogId}/comments`, page],
    queryFn: () => blogService.getComments(blogId, page),
    keepPreviousData: true,
  });

  // Normalize API shape safely
  const comments = useMemo(() => {
    if (Array.isArray(data)) return data;
    return data?.data || [];
  }, [data]);

  const totalPages = data?.totalPages || 1;
  const totalComments = data?.totalComments || (Array.isArray(data) ? data.length : 0);

  if (isLoading && page === 1) {
    return (
      <div className="text-center py-4" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4" role="alert">
        <p className="text-red-500">
          Error loading comments{error.message ? `: ${error.message}` : "."}
        </p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 mb-4" aria-live="polite">
        Showing {comments.length} of {totalComments} comments
      </div>

      {comments.map((comment, index) => {
        const created = comment.createdAt ? parseISO(comment.createdAt) : null;
        const dateText = created && isValid(created) ? format(created, "MMM d, yyyy") : "Unknown date";

        return (
          <div key={comment._id || `${index}-${comment.user?.username || "anon"}`} className="space-y-2">
            <div className="flex items-start space-x-4">
              <div
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium"
                aria-label={`Avatar ${comment.user?.username || "Anonymous User"}`}
              >
                {comment.user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{comment.user?.username || "Anonymous User"}</span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                    {dateText}
                  </span>
                </div>
                <div className="mt-2 text-gray-700 whitespace-pre-wrap">{comment.content}</div>
              </div>
            </div>
            {index < comments.length - 1 && <Separator className="my-4" />}
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            aria-label="Previous page"
          >
            Previous
          </Button>

          <span className="py-2 px-3 text-sm" aria-live="polite">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(CommentList);