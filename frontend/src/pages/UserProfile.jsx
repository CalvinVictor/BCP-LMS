import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit2, Camera, GraduationCap, Clock, Target } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Benzzz",
    email: "ushavink0812@gmail.com",
    phone: " +91 9945438905",
    location: "Bengaluru, India",
    joinDate: "March 2024",
    bio: "Passionate learner exploring web development and data science. Currently pursuing advanced certifications in React and Python.",
    role: "Student",
    coursesCompleted: 12,
    certificatesEarned: 5,
    currentStreak: 15,
    totalHours: 248
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your MongoDB backend
    console.log('Profile updated:', userData);
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute -bottom-16 left-8 z-10">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 p-2 rounded-full shadow-lg transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-3xl font-bold text-gray-800 bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
                )}
                <p className="text-purple-600 font-medium mt-1">{userData.role}</p>
                <div className="flex items-center space-x-4 mt-3 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {userData.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{userData.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEdit}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-800">{userData.coursesCompleted}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-medium text-sm">Certificates Earned</p>
                <p className="text-2xl font-bold text-gray-800">{userData.certificatesEarned}</p>
              </div>
              <Award className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-gray-800">{userData.currentStreak} days</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-medium text-sm">Total Hours</p>
                <p className="text-2xl font-bold text-gray-800">{userData.totalHours}h</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                About Me
              </h2>
              {isEditing ? (
                <textarea
                  value={userData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full h-32 p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{userData.bio}</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Completed "Advanced React Patterns"</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Earned "Python Fundamentals" Certificate</p>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Started learning "MongoDB Basics"</p>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-1 p-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <span className="text-gray-600">{userData.email}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1 p-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <span className="text-gray-600">{userData.phone}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="flex-1 p-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <span className="text-gray-600">{userData.location}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">React Development</span>
                    <span className="text-sm text-purple-600 font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full w-[85%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Python Programming</span>
                    <span className="text-sm text-purple-600 font-medium">72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full w-[72%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">MongoDB</span>
                    <span className="text-sm text-purple-600 font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full w-[45%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;