import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Camera, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Leaf, 
  Recycle, 
  Star,
  Trophy,
  Target,
  Clock,
  Users,
  ChevronRight,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data - replace with real data from your backend
  const userData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/api/placeholder/80/80",
    ecoPoints: 1250,
    rank: 5,
    level: "Eco Warrior",
    joinDate: "March 2024",
    totalWasteClassified: 89,
    campaignsJoined: 12,
    streakDays: 15,
    carbonSaved: 45.2
  };

  const recentActivities = [
    { id: 1, type: "classification", item: "Plastic Bottle", points: 15, time: "2 hours ago", icon: Recycle },
    { id: 2, type: "campaign", item: "Beach Cleanup Drive", points: 50, time: "1 day ago", icon: Users },
    { id: 3, type: "classification", item: "Food Waste", points: 10, time: "2 days ago", icon: Leaf },
    { id: 4, type: "achievement", item: "Week Streak Milestone", points: 25, time: "3 days ago", icon: Trophy }
  ];

  const activeCampaigns = [
    { id: 1, title: "City Park Cleanup", participants: 45, deadline: "Dec 28", progress: 75 },
    { id: 2, title: "E-Waste Collection", participants: 32, deadline: "Dec 30", progress: 60 },
    { id: 3, title: "Compost Workshop", participants: 28, deadline: "Jan 5", progress: 85 }
  ];

  const achievements = [
    { id: 1, title: "First Classification", icon: Star, earned: true },
    { id: 2, title: "Week Streak", icon: Calendar, earned: true },
    { id: 3, title: "Campaign Leader", icon: Users, earned: false },
    { id: 4, title: "Eco Master", icon: Trophy, earned: false }
  ];

  const leaderboardData = [
    { rank: 1, name: "Emma Wilson", points: 2150, avatar: "/api/placeholder/40/40" },
    { rank: 2, name: "Mike Chen", points: 1980, avatar: "/api/placeholder/40/40" },
    { rank: 3, name: "Alex Rodriguez", points: 1750, avatar: "/api/placeholder/40/40" },
    { rank: 4, name: "Lisa Park", points: 1520, avatar: "/api/placeholder/40/40" },
    { rank: 5, name: "You", points: userData.ecoPoints, avatar: userData.avatar, isUser: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br mt-10 from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">EcoWise</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-green-600" />
              <Settings className="h-6 w-6 text-gray-600 cursor-pointer hover:text-green-600" />
              <LogOut className="h-6 w-6 text-gray-600 cursor-pointer hover:text-red-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name}!</h1>
              <p className="text-green-100 text-lg">Ready to make a positive impact today?</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 mb-2">
                <img 
                  src={userData.avatar} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full mx-auto"
                />
              </div>
              <div className="text-sm text-green-100">{userData.level}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">EcoPoints</p>
                <p className="text-3xl font-bold text-green-600">{userData.ecoPoints}</p>
              </div>
              <Award className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Global Rank</p>
                <p className="text-3xl font-bold text-blue-600">#{userData.rank}</p>
              </div>
              <Trophy className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Classified</p>
                <p className="text-3xl font-bold text-orange-600">{userData.totalWasteClassified}</p>
              </div>
              <Camera className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Streak Days</p>
                <p className="text-3xl font-bold text-purple-600">{userData.streakDays}</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Camera className="h-8 w-8 text-green-600" />
                    <span className="font-medium text-gray-900">Classify Waste</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    <span className="font-medium text-gray-900">Find Campaigns</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-900">{activity.item}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-green-600">+{activity.points} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Active Campaigns</h3>
              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
                      <span className="text-sm text-gray-600">Due: {campaign.deadline}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{campaign.participants} participants</span>
                      <span className="text-sm font-medium text-green-600">{campaign.progress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h3>
              <div className="space-y-3">
                {leaderboardData.map((user) => (
                  <div key={user.rank} className={`flex items-center space-x-3 p-3 rounded-lg ${user.isUser ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                    <span className="font-bold text-gray-600 w-6">#{user.rank}</span>
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div className="flex-grow">
                      <p className={`font-medium ${user.isUser ? 'text-green-900' : 'text-gray-900'}`}>
                        {user.name}
                      </p>
                    </div>
                    <span className={`font-semibold ${user.isUser ? 'text-green-600' : 'text-gray-600'}`}>
                      {user.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={achievement.id} className={`p-3 rounded-lg text-center ${achievement.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <IconComponent className={`h-8 w-8 mx-auto mb-2 ${achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`} />
                      <p className={`text-sm font-medium ${achievement.earned ? 'text-yellow-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Your Environmental Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Carbon Saved</span>
                  <span className="font-bold">{userData.carbonSaved} kg CO₂</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Trees Equivalent</span>
                  <span className="font-bold">2.1 trees</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Water Saved</span>
                  <span className="font-bold">157 liters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;