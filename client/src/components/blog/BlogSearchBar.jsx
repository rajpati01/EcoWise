import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

const BlogSearchBar = memo(({ searchTerm, onSearchChange, isAuthenticated, onWriteClick }) => {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      role="search"
    >
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label="Search articles"
        />
      </div>

      {isAuthenticated && (
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={onWriteClick}
          aria-label="Write new article"
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Write Article
        </Button>
      )}
    </div>
  );
});

export default BlogSearchBar;
