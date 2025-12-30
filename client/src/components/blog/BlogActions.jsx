import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Share } from "lucide-react";

const BlogActions = memo(({
  blog,
  hasUserLiked,
  showComments,
  commentCount,
  countLoading,
  isLikePending,
  onLikeClick,
  onToggleComments,
  onShare,
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex space-x-4">
        <Button
          variant={hasUserLiked ? "default" : "outline"}
          className="flex items-center"
          onClick={onLikeClick}
          disabled={isLikePending}
          aria-label={hasUserLiked ? "Unlike blog" : "Like blog"}
        >
          <ThumbsUp
            className={`mr-2 h-4 w-4 ${hasUserLiked ? "text-white" : ""}`}
            aria-hidden="true"
          />
          <span>{hasUserLiked ? "Liked" : "Like"}</span>
          {blog.likes?.length > 0 && (
            <Badge
              variant={hasUserLiked ? "outline" : "secondary"}
              className="ml-2"
            >
              {blog.likes.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={showComments ? "default" : "outline"}
          className="flex items-center"
          onClick={onToggleComments}
          aria-label={showComments ? "Hide comments" : "Show comments"}
          aria-expanded={showComments}
        >
          <MessageSquare
            className={`mr-2 h-4 w-4 ${showComments ? "text-white" : ""}`}
            aria-hidden="true"
          />
          <span>{showComments ? "Hide Comments" : "Comments"}</span>
          {!countLoading && commentCount > 0 && (
            <Badge
              variant={showComments ? "outline" : "secondary"}
              className="ml-2"
            >
              {commentCount}
            </Badge>
          )}
        </Button>
      </div>
      <Button
        variant="outline"
        className="flex items-center"
        onClick={onShare}
        aria-label="Share blog"
      >
        <Share className="mr-2 h-4 w-4" aria-hidden="true" />
        <span>Share</span>
      </Button>
    </div>
  );
});

export default BlogActions;
