import { memo, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import { formatBlogDate, getAuthorDisplay } from "@/utils/blogHelpers";
import { getStatusBadge } from "@/utils/statusHelpers";

// Constants
const MAX_VISIBLE_TAGS = 3;
const IMAGE_HEIGHT_CLASS = "h-48";
const EXCERPT_LINE_CLAMP = "line-clamp-3";

const BlogCard = memo(({ blog, showStatus = false }) => {
  // Memoize computed values to prevent recalculation on every render
  const formattedDate = useMemo(
    () => formatBlogDate(blog.createdAt),
    [blog.createdAt]
  );

  const authorName = useMemo(
    () => getAuthorDisplay(blog.authorName, blog.authorId),
    [blog.authorName, blog.authorId]
  );

  const visibleTags = useMemo(
    () => blog.tags?.slice(0, MAX_VISIBLE_TAGS) || [],
    [blog.tags]
  );

  const remainingTagsCount = useMemo(
    () => Math.max(0, (blog.tags?.length || 0) - MAX_VISIBLE_TAGS),
    [blog.tags]
  );

  return (
    <Card className="hover-lift h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
            {blog.title}
          </CardTitle>
          {showStatus && getStatusBadge(blog.status)}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Blog Image */}
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={`Cover image for ${blog.title}`}
            className={`w-full ${IMAGE_HEIGHT_CLASS} object-cover rounded-lg`}
            loading="lazy"
          />
        )}

        {/* Excerpt */}
        {blog.excerpt && (
          <p
            className={`text-gray-600 leading-relaxed ${EXCERPT_LINE_CLAMP} flex-1`}
          >
            {blog.excerpt}
          </p>
        )}

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Blog tags"
          >
            {visibleTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs"
                role="listitem"
              >
                {tag}
              </Badge>
            ))}
            {remainingTagsCount > 0 && (
              <Badge variant="outline" className="text-xs" role="listitem">
                +{remainingTagsCount} more
              </Badge>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" aria-hidden="true" />
              <span className="text-sm text-gray-600">By {authorName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <time dateTime={blog.createdAt}>{formattedDate}</time>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Link href={`/blog/${blog._id}`}>
          <Button
            variant="outline"
            className="w-full group"
            aria-label={`Read more about ${blog.title}`}
          >
            Read More
            <ArrowRight
              className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
});

export default BlogCard;
