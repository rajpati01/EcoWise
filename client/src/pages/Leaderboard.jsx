import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Leaf, 
  Calendar, 
  Camera, 
  Users, 
  TrendingUp, 
  Filter,
  Search,
  Award,
  MapPin,
  Clock,
  Recycle,
  Target,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [timeFrame, setTimeFrame] = useState('all-time');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  // Mock leaderboard data - replace with real data from your backend
  const globalLeaderboard = [
    {
      id: 1,
      rank: 1,
      name: "Emma Wilson",
      avatar: "/api/placeholder/60/60",
      ecoPoints: 2850,
      level: "Eco Master",
      totalClassifications: 245,
      campaignsJoined: 28,
      streakDays: 45,
      location: "San Francisco, CA",
      joinDate: "Jan 2024",
      carbonSaved: 125.5,
      achievements: [
        { name: "Waste Warrior", icon: Trophy, color: "text-yellow-500" },
        { name: "Campaign Leader", icon: Users, color: "text-blue-500" },
        { name: "Streak Master", icon: Calendar, color: "text-green-500" },
        { name: "Eco Pioneer", icon: Leaf, color: "text-emerald-500" }
      ],
      badges: ["Top Classifier", "Community Leader", "Eco Advocate"],
      recentActivity: "Classified 15 items today"
    },
    {
      id: 2,
      rank: 2,
      name: "Michael Chen",
      avatar: "/api/placeholder/60/60",
      ecoPoints: 2650,
      level: "Eco Champion",
      totalClassifications: 198,
      campaignsJoined: 22,
      streakDays: 32,
      location: "New York, NY",
      joinDate: "Feb 2024",
      carbonSaved: 98.2,
      achievements: [
        { name: "Classification Pro", icon: Camera, color: "text-purple-500" },
        { name: "Team Player", icon: Users, color: "text-blue-500" },
        { name: "Consistent Contributor", icon: Target, color: "text-red-500" }
      ],
      badges: ["Tech Innovator", "Green Guru"],
      recentActivity: "Joined Beach Cleanup campaign"
    },
    {
      id: 3,
      rank: 3,
      name: "Sarah Johnson",
      avatar: "/api/placeholder/60/60",
      ecoPoints: 2420,
      level: "Eco Warrior",
      totalClassifications: 176,
      campaignsJoined: 19,
      streakDays: 28,
      location: "Los Angeles, CA",
      joinDate: "Mar 2024",
      carbonSaved: 87.3,
      achievements: [
        { name: "Daily Dedication", icon: Calendar, color: "text-green-500" },
        { name: "Impact Maker", icon: Leaf, color: "text-emerald-500" },
        { name: "Rising Star", icon: Star, color: "text-yellow-500" }
      ],
      badges: ["Sustainability Champion"],
      recentActivity: "Achieved 30-day streak"
    },
    {
      id: 4,
      rank: 4,
      name: "Alex Rodriguez",
      avatar: "/api/placeholder/60/60",
      ecoPoints: 2180,
      level: "Eco Enthusiast",
      totalClassifications: 142,
      campaignsJoined: 16,
      streakDays: 21,
      location: "Chicago, IL",
      joinDate: "Apr 2024",
      carbonSaved: 76.8,
      achievements: [
        { name: "Quick Learner", icon: Zap, color: "text-orange-500" },
        { name: "Community Helper", icon: Users, color: "text-blue-500" }
      ],
      badges: ["Eco Newbie", "Fast Climber"],
      recentActivity: "Created new campaign"
    },
    {
      id: 5,
      rank: 5,
      name: "Lisa Park",
      avatar: "/api/placeholder/60/60",
      ecoPoints: 1950,
      level: "Eco Supporter",
      totalClassifications: 128,
      campaignsJoined: 14,
      streakDays: 18,
      location: "Seattle, WA",
      joinDate: "May 2024",
      carbonSaved: 65.4,
      achievements: [
        { name: "Steady Progress", icon: TrendingUp, color: "text-indigo-500" },
        { name: "Team Supporter", icon: Users, color: "text-blue-500" }
      ],
      badges: ["Consistent Contributor"],
      recentActivity: "Completed recycling workshop"
    }
  ];

  // Generate more users for demonstration
  const extendedLeaderboard = [...globalLeaderboard];
  for (let i = 6; i <= 50; i++) {
    extendedLeaderboard.push({
      id: i,
      rank: i,
      name: `User ${i}`,
      avatar: `/api/placeholder/60/60`,
      ecoPoints: Math.floor(Math.random() * 1500) + 500,
      level: ["Eco Beginner", "Eco Supporter", "Eco Enthusiast"][Math.floor(Math.random() * 3)],
      totalClassifications: Math.floor(Math.random() * 100) + 20,
      campaignsJoined: Math.floor(Math.random() * 10) + 2,
      streakDays: Math.floor(Math.random() * 30) + 1,
      location: ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX"][Math.floor(Math.random() * 4)],
      joinDate: "2024",
      carbonSaved: Math.floor(Math.random() * 50) + 10,
      achievements: [
        { name: "Getting Started", icon: Star, color: "text-yellow-500" }
      ],
      badges: ["Newcomer"],
      recentActivity: "Recently joined EcoWise"
    });
  }

  const filteredLeaderboard = extendedLeaderboard.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Medal className="h-8 w-8 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      "Eco Master": "text-purple-600 bg-purple-100",
      "Eco Champion": "text-blue-600 bg-blue-100",
      "Eco Warrior": "text-green-600 bg-green-100",
      "Eco Enthusiast": "text-orange-600 bg-orange-100",
      "Eco Supporter": "text-indigo-600 bg-indigo-100",
      "Eco Beginner": "text-gray-600 bg-gray-100"
    };
    return colors[level] || "text-gray-600 bg-gray-100";
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">EcoWise</span>
              </div>
              <div className="hidden md:block text-gray-400">|</div>
              <h1 className="hidden md:block text-2xl font-bold text-gray-900">Leaderboard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-4xl font-bold mb-2">EcoWise Champions</h1>
            <p className="text-xl text-green-100">Celebrating our environmental heroes making a difference</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('global')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'global'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setActiveTab('local')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'local'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Local
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'friends'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Friends
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all-time">All Time</option>
                <option value="this-month">This Month</option>
                <option value="this-week">This Week</option>
                <option value="today">Today</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Top Champions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {globalLeaderboard.slice(0, 3).map((user, index) => (
              <div key={user.id} className={`bg-white rounded-xl p-6 shadow-lg border-2 ${index === 0 ? 'border-yellow-300 transform scale-105' : index === 1 ? 'border-gray-300' : 'border-amber-300'}`}>
                <div className="text-center">
                  <div className="relative mb-4">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(user.rank)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(user.level)}`}>
                    {user.level}
                  </span>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">EcoPoints</span>
                      <span className="font-bold text-green-600">{user.ecoPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classifications</span>
                      <span className="font-medium">{user.totalClassifications}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Campaigns</span>
                      <span className="font-medium">{user.campaignsJoined}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-1 mt-4">
                    {user.achievements.slice(0, 3).map((achievement, idx) => {
                      const IconComponent = achievement.icon;
                      return (
                        <IconComponent 
                          key={idx} 
                          className={`h-6 w-6 ${achievement.color}`}
                          title={achievement.name}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Complete Rankings</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredLeaderboard.map((user) => (
              <div key={user.id} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 text-center">
                    {user.rank <= 3 ? getRankIcon(user.rank) : (
                      <span className="text-xl font-bold text-gray-600">#{user.rank}</span>
                    )}
                  </div>
                  
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                        {user.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Joined {user.joinDate}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center space-x-8 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{user.ecoPoints.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">EcoPoints</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-blue-600">{user.totalClassifications}</div>
                      <div className="text-sm text-gray-600">Classifications</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-purple-600">{user.campaignsJoined}</div>
                      <div className="text-sm text-gray-600">Campaigns</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-orange-600">{user.streakDays}</div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleUserExpansion(user.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {expandedUser === user.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Mobile Stats */}
                <div className="md:hidden mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">{user.ecoPoints.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">EcoPoints</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{user.totalClassifications}</div>
                    <div className="text-sm text-gray-600">Classifications</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">{user.campaignsJoined}</div>
                    <div className="text-sm text-gray-600">Campaigns</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-orange-600">{user.streakDays}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {expandedUser === user.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Achievements</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.achievements.map((achievement, idx) => {
                            const IconComponent = achievement.icon;
                            return (
                              <div key={idx} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <IconComponent className={`h-5 w-5 ${achievement.color}`} />
                                <span className="text-sm font-medium text-gray-700">{achievement.name}</span>
                              </div>
                            );
                          })}
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-3 mt-4">Badges</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.badges.map((badge, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Environmental Impact</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carbon Saved</span>
                            <span className="font-semibold text-green-600">{user.carbonSaved} kg CO₂</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trees Equivalent</span>
                            <span className="font-semibold text-green-600">{(user.carbonSaved / 21.7).toFixed(1)} trees</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Recent Activity</span>
                            <span className="text-sm text-gray-600">{user.recentActivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;