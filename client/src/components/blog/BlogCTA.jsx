import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";

const BlogCTA = memo(({ isAuthenticated }) => {
  if (isAuthenticated) return null;

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="text-center py-8">
        <PenTool className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Share Your Knowledge
        </h3>
        <p className="text-gray-600 mb-4">
          Join our community to write articles and share your eco-friendly tips!
        </p>
        <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
      </CardContent>
    </Card>
  );
});

export default BlogCTA;
