
import React from "react";

const Blog = () => {
  // In a real app, you would fetch blog posts from MongoDB via your backend
  const dummyPosts = [
    {
      id: 1,
      title: "10 Simple Ways to Reduce Household Waste",
      date: "June 1, 2025",
      excerpt: "From composting to reusable containers, here are ten easy ways to reduce your daily waste footprint...",
    },
    {
      id: 2,
      title: "How AI is Transforming Waste Management",
      date: "May 25, 2025",
      excerpt: "AI models like TensorFlow.js are helping identify and sort waste in real-time — a game changer for sustainability...",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-6">EcoWise Blog</h1>
      <p className="text-gray-700 text-lg mb-10">
        Stay informed with the latest updates, tips, and research in sustainable living and waste management.
      </p>
      <div className="space-y-8">
        {dummyPosts.map((post) => (
          <div key={post.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{post.date}</p>
            <p className="text-gray-700">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
