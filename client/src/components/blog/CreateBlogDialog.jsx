import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const CreateBlogDialog = memo(({ open, onOpenChange, newBlog, onInputChange, onSubmit, isSubmitting }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby="new-blog-description">
        <DialogHeader>
          <DialogTitle>Write New Article</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" id="new-blog-description">
          <div>
            <Label htmlFor="title">Article Title</Label>
            <Input
              id="title"
              name="title"
              value={newBlog.title}
              onChange={onInputChange}
              placeholder="10 Tips for Zero Waste Living"
              required
              aria-required="true"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={newBlog.excerpt}
              onChange={onInputChange}
              placeholder="A brief summary of your article..."
              rows={2}
              required
              aria-required="true"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={newBlog.content}
              onChange={onInputChange}
              placeholder="Write your full article here..."
              rows={8}
              required
              aria-required="true"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={newBlog.tags}
              onChange={onInputChange}
              placeholder="sustainability, recycling, zero-waste"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            aria-label={isSubmitting ? "Publishing article" : "Publish article"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Publishing...
              </>
            ) : (
              "Publish Article"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default CreateBlogDialog;
