import React, { useState } from 'react';
import { Users, X, MapPin, Calendar, User, ChevronRight, Target, Clock, Award } from 'lucide-react';

const Campaigns = ({ setCurrentPage }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [campaigns] = useState([
    {
      id: 1,
      title: 'Bagmati River Cleanup',
      description: 'Join us for a community cleanup along the Bagmati River. Together we can restore our waterways!',
      location: 'Bagmati River, Kathmandu',
      date: '2025-06-15',
      participants: 32,
      organizer: 'Green Nepal Initiative',
      status: 'upcoming',
      category: 'Water Conservation',
      ecoPoints: 50,
      image: '/api/placeholder/400/200'
    },
    {
      id: 2,
      title: 'Plastic-Free Thamel Campaign',
      description: 'Help make Thamel plastic-free by distributing reusable bags and educating tourists.',
      location: 'Thamel, Kathmandu',
      date: '2025-06-20',
      participants: 18,
      organizer: 'Eco Warriors Nepal',
      status: 'upcoming',
      category: 'Plastic Reduction',
      ecoPoints: 75,
      image: '/api/placeholder/400/200'
    },
    {
      id: 3,
      title: 'School Waste Awareness Program',
      description: 'Educational program teaching students about proper waste segregation and recycling.',
      location: 'Various Schools, Kathmandu Valley',
      date: '2025-06-25',
      participants: 45,
      organizer: 'EcoWise Education Team',
      status: 'upcoming',
      category: 'Education',
      ecoPoints: 60,
      image: '/api/placeholder/400/200'
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    location: '',
    date: '',
    expectedParticipants: '',
    description: '',
    category: 'Education'
  });

  const handleInputChange = (e) => {
    setNewCampaign({
      ...newCampaign,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateCampaign = () => {
    // Here you would typically make an API call to create the campaign
    console.log('Creating campaign:', newCampaign);
    setShowCreateForm(false);
    setNewCampaign({
      title: '',
      location: '',
      date: '',
      expectedParticipants: '',
      description: '',
      category: 'Education'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Water Conservation': return '🌊';
      case 'Plastic Reduction': return '♻️';
      case 'Education': return '📚';
      default: return '🌱';
    }
  };

  return (
    <div className="pt-24">
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community <span className="text-green-600">Campaigns</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join local environmental initiatives and make a difference in your community. 
            Every action counts towards a sustainable future.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Users className="h-6 w-6" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-green-100">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{campaigns.length}</h3>
            <p className="text-gray-600">Active Campaigns</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-blue-100">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {campaigns.reduce((sum, campaign) => sum + campaign.participants, 0)}
            </h3>
            <p className="text-gray-600">Total Participants</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-purple-100">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {campaigns.reduce((sum, campaign) => sum + campaign.ecoPoints, 0)}
            </h3>
            <p className="text-gray-600">Total EcoPoints</p>
          </div>
        </div>

        {/* Create Campaign Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Create New Campaign</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={newCampaign.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter campaign title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <select
                        name="category"
                        value={newCampaign.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      >
                        <option value="Education">Education</option>
                        <option value="Water Conservation">Water Conservation</option>
                        <option value="Plastic Reduction">Plastic Reduction</option>
                        <option value="Tree Plantation">Tree Plantation</option>
                        <option value="Waste Management">Waste Management</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={newCampaign.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Event location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={newCampaign.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Participants</label>
                    <input
                      type="number"
                      name="expectedParticipants"
                      value={newCampaign.expectedParticipants}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Expected number of participants"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                    <textarea
                      rows="4"
                      name="description"
                      value={newCampaign.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your campaign goals and activities in detail"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end mt-8 space-x-4">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateCampaign}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg"
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
              {/* Campaign Image */}
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-800">{getCategoryIcon(campaign.category)}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                    {campaign.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                  {campaign.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-green-600" />
                    <span>{campaign.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>{formatDate(campaign.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2 text-green-600" />
                    <span>by {campaign.organizer}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{campaign.participants}</p>
                      <p className="text-xs text-gray-500">Participants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{campaign.ecoPoints}</p>
                      <p className="text-xs text-gray-500">EcoPoints</p>
                    </div>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2 shadow-md">
                    <span>Join</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 font-semibold shadow-lg">
            Load More Campaigns
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Campaigns;