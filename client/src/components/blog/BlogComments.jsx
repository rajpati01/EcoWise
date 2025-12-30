import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const BlogComments = memo(({ blogId, commentCount, countLoading, onCommentAdded }) => {
  return (
    <section aria-label="Comments section">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" aria-hidden="true" />
            Comments ({countLoading ? "..." : commentCount})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CommentForm blogId={blogId} onCommentAdded={onCommentAdded} />
          <Separator />
          <CommentList blogId={blogId} />
        </CardContent>
      </Card>
    </section>
  );
});

export default BlogComments;
