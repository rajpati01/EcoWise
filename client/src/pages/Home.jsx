import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Map, Trophy, BookOpen, ChevronRight, Camera, Users, Leaf, Calendar, Clock, User,ArrowRight, Heart, MessageCircle} from 'lucide-react';

const Home = () => {

  // Mock data for blogs
   const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock API call - Replace with actual API endpoint
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - Replace with actual API call
        const mockBlogs = [
          {
            _id: '1',
            title: "The Ultimate Guide to Zero Waste Living in 2025",
            excerpt: "Discover practical strategies to reduce your environmental footprint and embrace a zero waste lifestyle with simple daily changes.",
            slug: "ultimate-guide-zero-waste-living-2025",
            author: {
              name: "Rajpati Bhandari",
              avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=64&h=64&fit=crop&crop=face"
            },
            publishedAt: "2025-06-01T10:00:00Z",
            readTime: 8,
            category: {
              name: "Zero Waste",
              color: "green"
            },
            featuredImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=250&fit=crop",
            stats: {
              likes: 124,
              comments: 23,
              views: 1542
            },
            tags: ["zero-waste", "lifestyle", "sustainability"]
          },
          {
            _id: '2',
            title: "How AI is Revolutionizing Waste Management",
            excerpt: "Explore cutting-edge technologies transforming how we sort, process, and recycle waste materials globally.",
            slug: "ai-revolutionizing-waste-management",
            author: {
              name: "Dr. Anubhav Pokhrel",
              avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=64&h=64&fit=crop&crop=face"
            },
            publishedAt: "2025-05-28T14:30:00Z",
            readTime: 6,
            category: {
              name: "Technology",
              color: "blue"
            },
            featuredImage: "https://images.pexels.com/photos/8438979/pexels-photo-8438979.jpeg?w=400&h=250&fit=crop",
            stats: {
              likes: 89,
              comments: 15,
              views: 987
            },
            tags: ["AI", "technology", "innovation"]
          },
          {
            _id: '3',
            title: "Top 10 Eco-Friendly Alternatives to Plastic",
            excerpt: "Simple swaps that make a big difference. Replace everyday plastic items with sustainable alternatives easily.",
            slug: "eco-friendly-alternatives-plastic-products",
            author: {
              name: "Bibek Dulal",
              avatar: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?w=64&h=64&fit=crop&crop=face"
            },
            publishedAt: "2025-05-25T09:15:00Z",
            readTime: 5,
            category: {
              name: "Lifestyle",
              color: "emerald"
            },
            featuredImage: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=400&h=250&fit=crop",
            stats: {
              likes: 156,
              comments: 31,
              views: 2103
            },
            tags: ["eco-friendly", "plastic-free", "alternatives"]
          }
        ];
        
        setBlogs(mockBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      emerald: 'bg-emerald-100 text-emerald-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      pink: 'bg-pink-100 text-pink-800'
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate('/blogs');
  };

  const handleBlogClick = (slug) => {
    // Navigate to individual blog post
    window.location.href = `/blogs/${slug}`;
    // or using React Router: navigate(`/blogs/${slug}`);
    // or using Next.js: router.push(`/blogs/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-gray-600">Stay updated with sustainability tips and eco-friendly insights</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-6">
                  <div className="bg-gray-200 h-4 w-20 rounded mb-3"></div>
                  <div className="bg-gray-200 h-6 w-full rounded mb-2"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-2/3 rounded mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
                      <div className="bg-gray-200 h-4 w-20 rounded"></div>
                    </div>
                    <div className="bg-gray-200 h-4 w-16 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
            Sustainable Future Through <span className="text-primary-400">Smart Waste Management</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-200">
            Join our community, classify waste using AI, earn rewards, and participate in local environmental campaigns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/classify"
              className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center"
            >
              <Camera className="mr-2 h-5 w-5" />
              Classify Waste
            </Link>
            <Link
              to="/si gnup"
              className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-10 w-10 text-white rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How EcoWise Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines AI technology, gamification, and community action to promote sustainable waste management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                <Recycle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">AI Waste Classification</h3>
              <p className="text-gray-600">
                Upload images of waste items and our AI will classify them and provide proper disposal guidance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-6">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">EcoPoints & Rewards</h3>
              <p className="text-gray-600">
                Earn points for classifying waste, engaging with content, and participating in campaigns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-600 mb-6">
                <Map className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Community Campaigns</h3>
              <p className="text-gray-600">
                Join or create local clean-up events and campaigns to make a real difference in your community.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Educational Resources</h3>
              <p className="text-gray-600">
                Access our blog with articles, guides, and tips on sustainable living and waste management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Leaf className="h-16 w-16 mx-auto mb-6 text-white opacity-80" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8">
              Join thousands of environmentally conscious individuals working together for a cleaner, greener planet.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-white text-primary-600 font-bold rounded-md hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>

      {/* Latest Blogs Section */}
      <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Latest from Our Blog</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest sustainability tips, eco-friendly insights, and environmental innovations
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog) => (
            <article 
              key={blog._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
              onClick={() => handleBlogClick(blog.slug)}
            >
              {/* Featured Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={blog.featuredImage} 
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category.color)}`}>
                    {blog.category.name}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Meta Information */}
                <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                
                {/* Author and Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={blog.author.avatar} 
                      alt={blog.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">{blog.author.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{blog.stats.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{blog.stats.comments}</span>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {blog.tags.length > 2 && (
                    <span className="text-gray-400 text-xs px-2 py-1">
                      +{blog.tags.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <button
            onClick={handleViewMore}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>View More Articles</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <p className="text-gray-500 text-sm mt-3">
            Discover more sustainability tips and eco-friendly guides
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default Home;

