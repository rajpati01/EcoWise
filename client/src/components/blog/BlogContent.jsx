import { memo, useMemo } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BlogContent = memo(({ blog }) => {
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
        "h4",
        "ul",
        "ol",
        "li",
        "a",
        "blockquote",
        "code",
        "pre",
        "img",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt"],
    });
  }, [blog?.content]);

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6 md:p-8">
        {blog.excerpt && (
          <>
            <p className="text-lg font-medium text-gray-700 italic mb-6">
              {blog.excerpt}
            </p>
            <Separator className="my-6" />
          </>
        )}

        <div className="prose prose-green max-w-none">
          {blog.content?.includes("#") ? (
            <ReactMarkdown>{sanitizedContent}</ReactMarkdown>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default BlogContent;
