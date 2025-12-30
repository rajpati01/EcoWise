import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { formatBlogDate, getAuthorDisplay } from "@/utils/blogHelpers";

const BlogHeader = memo(({ blog }) => {
  const formattedDate = useMemo(
    () => (blog?.createdAt ? formatBlogDate(blog.createdAt) : "Unknown date"),
    [blog?.createdAt]
  );

  const authorName = useMemo(
    () => (blog ? getAuthorDisplay(blog.authorName, blog.authorId) : "Unknown"),
    [blog?.authorName, blog?.authorId]
  );

  return (
    <header className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        {blog.title}
      </h1>

      {/* Meta Information */}
      <div
        className="flex flex-wrap items-center gap-4 text-sm text-gray-600"
        role="contentinfo"
      >
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" aria-hidden="true" />
          <span>By {authorName}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
          <time dateTime={blog.createdAt}>{formattedDate}</time>
        </div>
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2" role="list" aria-label="Tags">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs" role="listitem">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </header>
  );
});

export default BlogHeader;
