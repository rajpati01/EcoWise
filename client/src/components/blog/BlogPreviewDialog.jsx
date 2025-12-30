import { memo, useMemo } from "react";
import DOMPurify from "dompurify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User } from "lucide-react";
import { formatBlogDate, getAuthorDisplay } from "@/utils/blogHelpers";
import { getStatusBadge } from "@/utils/statusHelpers";

// Constants
const MAX_CONTENT_HEIGHT = "max-h-96";
const IMAGE_MAX_HEIGHT = "max-h-60";

const BlogPreviewDialog = memo(({ open, onOpenChange, blog }) => {
  // Memoize computed values
  const formattedDate = useMemo(
    () => (blog?.createdAt ? formatBlogDate(blog.createdAt) : ""),
    [blog?.createdAt]
  );

  const authorName = useMemo(
    () => (blog ? getAuthorDisplay(blog.authorName, blog.authorId) : ""),
    [blog?.authorName, blog?.authorId]
  );

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = useMemo(() => {
    if (!blog?.content) return "";
    return DOMPurify.sanitize(blog.content, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "h1",
        "h2",
        "h3",
        "ul",
        "ol",
        "li",
        "a",
        "blockquote",
        "code",
        "pre",
      ],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  }, [blog?.content]);

  // Early return if no blog data
  if (!blog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" aria-describedby="blog-preview-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
            {blog.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className={MAX_CONTENT_HEIGHT}>
          <div className="space-y-4" id="blog-preview-description">
            {/* Author and Status */}
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span>By {authorName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={blog.createdAt}>{formattedDate}</time>
                </div>
              </div>
              {blog.status && getStatusBadge(blog.status)}
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-gray-600 leading-relaxed italic">
                {blog.excerpt}
              </p>
            )}

            {/* Cover Image */}
            {blog.coverImage && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={blog.coverImage}
                  alt={`Cover image for ${blog.title}`}
                  className={`w-full ${IMAGE_MAX_HEIGHT} object-cover`}
                  loading="lazy"
                />
              </div>
            )}

            {/* Content */}
            {sanitizedContent && (
              <div
                className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div
                className="flex flex-wrap gap-2 pt-3 border-t"
                role="list"
                aria-label="Blog tags"
              >
                {blog.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs"
                    role="listitem"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

export default BlogPreviewDialog;