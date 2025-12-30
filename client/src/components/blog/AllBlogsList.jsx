import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import BlogCard from "./BlogCard";

const AllBlogsList = memo(({ blogs, searchTerm }) => {
  return (
    <section aria-label="All articles">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Articles</h2>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Articles Found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Be the first to write an article!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
});

export default AllBlogsList;
