import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Clock, 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  ChevronRight,
  Leaf,
  Recycle,
  Globe,
  Lightbulb,
  Award,
  TrendingUp
} from 'lucide-react';

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Zero Waste Living in 2025",
      excerpt: "Discover practical strategies to reduce your environmental footprint and embrace a zero waste lifestyle. From simple swaps to advanced techniques.",
      content: "Zero waste living isn't just a trend—it's a sustainable lifestyle choice that can significantly impact our planet's future...",
      author: "Rajpati Bhandari",
      authorImage: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=64&h=64&fit=crop&crop=face",
      date: "2025-06-01",
      readTime: "8 min read",
      category: "zero-waste",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
      likes: 124,
      comments: 23,
      tags: ["zero-waste", "lifestyle", "sustainability"],
      featured: true
    },
    {
      id: 2,
      title: "How AI is Revolutionizing Waste Management",
      excerpt: "Explore the cutting-edge technologies transforming how we sort, process, and recycle waste materials globally.",
      content: "Artificial Intelligence is changing the game in waste management, from smart sorting systems to predictive analytics...",
      author: "Dr. Anubhav Pokharel",
      authorImage: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=64&h=64&fit=crop&crop=face",
      date: "2025-05-28",
      readTime: "6 min read",
      category: "technology",
      image: "https://images.pexels.com/photos/8438979/pexels-photo-8438979.jpeg?w=800&h=400&fit=crop",
      likes: 89,
      comments: 15,
      tags: ["AI", "technology", "innovation"],
      featured: false
    },
    {
      id: 3,
      title: "Top 10 Eco-Friendly Alternatives to Plastic Products",
      excerpt: "Simple swaps that make a big difference. Replace everyday plastic items with sustainable alternatives.",
      content: "Making the switch from plastic to eco-friendly alternatives doesn't have to be overwhelming...",
      author: "Bibek Dulal",
      authorImage: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?w=64&h=64&fit=crop&crop=face",
      date: "2025-05-25",
      readTime: "5 min read",
      category: "lifestyle",
      image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&h=400&fit=crop",
      likes: 156,
      comments: 31,
      tags: ["eco-friendly", "plastic-free", "alternatives"],
      featured: false
    },
    {
      id: 4,
      title: "Understanding the Circular Economy: A Beginner's Guide",
      excerpt: "Learn about the circular economy model and how it's reshaping industries to create a more sustainable future.",
      content: "The circular economy represents a fundamental shift from our traditional linear 'take-make-dispose' model...",
      author: "Prof. Rita Sharma",
      authorImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=64&h=64&fit=crop&crop=face",
      date: "2025-05-22",
      readTime: "7 min read",
      category: "education",
      image: "https://images.pexels.com/photos/39656/staircase-spiral-architecture-interior-39656.jpeg?w=800&h=400&fit=crop",
      likes: 98,
      comments: 18,
      tags: ["circular-economy", "sustainability", "education"],
      featured: false
    },
    {
      id: 5,
      title: "Global Recycling Innovations: Success Stories from Around the World",
      excerpt: "Inspiring examples of how different countries are tackling waste management and recycling challenges.",
      content: "From Sweden's waste-to-energy programs to Japan's meticulous sorting systems, discover innovative approaches...",
      author: "Harish Kumar",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      date: "2025-05-20",
      readTime: "9 min read",
      category: "global",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop",
      likes: 142,
      comments: 27,
      tags: ["recycling", "global", "innovation"],
      featured: true
    },
    {
      id: 6,
      title: "Building Sustainable Communities: Local Action for Global Impact",
      excerpt: "How grassroots movements and community initiatives are driving environmental change from the ground up.",
      content: "Change starts at home, in our neighborhoods and communities. Discover how local actions create global impact...",
      author: "Ranjita Thapa",
      authorImage: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=64&h=64&fit=crop&crop=face",
      date: "2025-05-18",
      readTime: "6 min read",
      category: "community",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
      likes: 87,
      comments: 19,
      tags: ["community", "sustainability", "local-action"],
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', icon: Globe, color: 'bg-gray-100 text-gray-700' },
    { id: 'zero-waste', name: 'Zero Waste', icon: Recycle, color: 'bg-green-100 text-green-700' },
    { id: 'technology', name: 'Technology', icon: Lightbulb, color: 'bg-blue-100 text-blue-700' },
    { id: 'lifestyle', name: 'Lifestyle', icon: Leaf, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'education', name: 'Education', icon: Award, color: 'bg-purple-100 text-purple-700' },
    { id: 'global', name: 'Global Impact', icon: TrendingUp, color: 'bg-orange-100 text-orange-700' },
    { id: 'community', name: 'Community', icon: Heart, color: 'bg-pink-100 text-pink-700' }
  ];

  // Filter posts based on category and search term
  useEffect(() => {
    let filtered = blogPosts;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm]);

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="pt-24">
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="text-green-600">Eco</span>Wise Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your source for sustainability insights, zero waste tips, and environmental innovation
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600 font-medium">Filter:</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : category.color
                } hover:scale-105 transform`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="h-6 w-6 text-yellow-500 mr-2" />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={post.authorImage} 
                          alt={post.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-700">{post.author}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center space-x-1 text-sm ${
                            likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500'
                          } hover:text-red-500 transition-colors`}
                        >
                          <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        
                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className={`${
                            bookmarkedPosts.has(post.id) ? 'text-green-500' : 'text-gray-500'
                          } hover:text-green-500 transition-colors`}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'Latest Articles' : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
            </h2>
            <span className="text-gray-500">{regularPosts.length} articles</span>
          </div>
          
          {regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (

          <div className="grid md:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow group">
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {post.isNew && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        New
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.authorImage} 
                        alt={post.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center space-x-1 text-sm ${
                          likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500'
                        } hover:text-red-500 transition-colors`}
                      >
                        <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className={`${
                          bookmarkedPosts.has(post.id) ? 'text-green-500' : 'text-gray-500'
                        } hover:text-green-500 transition-colors`}
                      >
                        <Bookmark className={`h-4 w-4 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="mt-4">
                    <button className="flex items-center text-green-600 hover:text-green-700 font-medium transition-colors">
                      <span>Read More</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-xl p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with EcoWise</h3>
            <p className="mb-6 opacity-90">
              Get the latest sustainability tips, zero waste guides, and environmental news delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              Join 10,000+ eco-conscious readers. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>
    </div>
    </div>
  );
};

export default Blogs;