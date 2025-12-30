import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { blogService } from "@/services/blogService";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const CommentForm = ({ blogId, onCommentAdded }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to post a comment.",
        variant: "destructive",
      });
      return;
    }

    const trimmed = comment.trim();
    if (!trimmed) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await blogService.addComment(blogId, trimmed);
      setComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });

      if (onCommentAdded) {
        onCommentAdded(response.data);
      } else {
        // Fallback: refresh comments list
        queryClient.invalidateQueries({
          queryKey: [`/api/blogs/${blogId}/comments`],
        });
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to post your comment. Please try again.";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600 mb-2">Login to join the discussion</p>
        <Button variant="outline" asChild>
          <Link to="/login">Login to Comment</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start space-x-4">
        <div
          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
          aria-label={`Avatar ${user?.username || "U"}`}
        >
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <Textarea
            aria-label="Add a comment"
            placeholder="Add to the discussion..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[80px]"
            maxLength={2000}
          />
          <div className="mt-1 text-xs text-gray-400" aria-live="polite">
            {comment.length}/2000
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="flex items-center"
          aria-label={isSubmitting ? "Posting comment" : "Post comment"}
        >
          {isSubmitting ? (
            <>Posting...</>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              Post Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;