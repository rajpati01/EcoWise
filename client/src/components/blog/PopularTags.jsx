import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PopularTags = memo(({ tags, onTagClick }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Popular tags">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => onTagClick(tag)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

export default PopularTags;
