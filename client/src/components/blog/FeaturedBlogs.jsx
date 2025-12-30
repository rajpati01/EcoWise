import { memo } from "react";
import BlogCard from "./BlogCard";

const FeaturedBlogs = memo(({ blogs }) => {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section aria-label="Featured articles">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Featured Articles
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
});

export default FeaturedBlogs;
