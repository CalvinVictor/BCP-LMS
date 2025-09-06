import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, BookOpen, Award, Edit2, Save, GraduationCap, Clock, Target, X } from 'lucide-react';
import apiService from '../services/apiService';
import Layout from '../Components/Layout';

// --- Modal Component for Completed Courses ---
const CompletedCoursesModal = ({ title, courses, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl border border-gray-700 max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <button onClick={onClose} aria-label="Close modal" className="text-gray-400 hover:text-white"><X size={24}/></button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] space-y-4">
                {courses.length > 0 ? courses.map(course => (
                    <Link to={`/course/${course._id}`} key={course._id} className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                        <img src={course.thumbnail || 'https://placehold.co/128x72/1f2937/ffffff?text=Course'} alt={course.title} className="w-32 h-18 object-cover rounded-md mr-4"/>
                        <div className="flex-1">
                            <h3 className="font-semibold text-white">{course.title}</h3>
                            <p className="text-sm text-gray-400">{course.category}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Certificate</p>
                            <Award className="w-6 h-6 text-yellow-400 mx-auto"/>
                        </div>
                    </Link>
                )) : (
                    <p className="text-gray-400 text-center py-8">You haven't completed any courses yet.</p>
                )}
            </div>
        </div>
    </div>
);

// --- Main User Profile Component ---
const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  
  const handleViewCompletedCourses = async () => {
      if (completedCourses.length > 0 && userData.coursesCompleted > 0) {
          setShowModal(true);
          return;
      }
      if (userData.coursesCompleted === 0) {
          setShowModal(true);
          return;
      }
      try {
          const data = await apiService.getMyCompletedCourses();
          setCompletedCourses(data);
          setShowModal(true);
      } catch (error) {
          console.error("Could not fetch completed courses", error);
      }
  };

  const handleSave = async () => {
    try {
      const { user } = await apiService.updateUserProfile(userData);
      setUserData(prev => ({ ...prev, ...user }));
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
      setMessage('Failed to update profile.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <Layout><div className="text-center text-white py-20">Loading Profile...</div></Layout>;
  if (!userData) return <Layout><div className="text-center text-red-400 py-20">Could not load profile.</div></Layout>;

  return (
    <Layout>
      {showModal && <CompletedCoursesModal title="My Achievements" courses={completedCourses} onClose={() => setShowModal(false)} />}
      <div className="max-w-6xl mx-auto p-4 text-white">
        {message && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4 text-center" role="alert">{message}</div>}
        
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-700">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
            <div className="absolute -bottom-16 left-8 z-10">
              <div className="w-32 h-32 bg-gray-700 rounded-full p-1 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-20 pb-6 px-8">
            <div className="flex justify-between items-start">
              <div>
                {isEditing ? (
                  <div>
                    <label htmlFor="username" className="text-sm font-medium text-gray-400">Username</label>
                    <input id="username" type="text" value={userData.username} onChange={(e) => handleInputChange('username', e.target.value)} className="text-3xl font-bold text-white bg-gray-700 border-2 border-gray-600 rounded-lg px-3 py-1 focus:border-purple-500 focus:outline-none"/>
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold">{userData.username}</h1>
                )}
                <p className="text-purple-400 font-medium mt-1 capitalize">{userData.role}</p>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"><Save size={16}/>Save</button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"><Edit2 size={16}/>Edit Profile</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button onClick={handleViewCompletedCourses} className="text-left w-full">
                <StatCard title="Courses Completed" value={userData.coursesCompleted} icon={BookOpen} color="purple"/>
            </button>
            <button onClick={handleViewCompletedCourses} className="text-left w-full">
                <StatCard title="Certificates Earned" value={userData.certificatesEarned} icon={Award} color="indigo"/>
            </button>
            <StatCard title="Current Streak" value={`${userData.currentStreak} days`} icon={Target} color="purple"/>
            <StatCard title="Total Hours" value={`${userData.totalHours}h`} icon={Clock} color="indigo"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg-col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-purple-400"/>About Me</h2>
              {isEditing ? (
                <div>
                  <label htmlFor="bio" className="sr-only">About Me</label>
                  <textarea id="bio" value={userData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} className="w-full h-32 p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none resize-none"/>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed">{userData.bio}</p>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                  <ContactField isEditing={isEditing} value={userData.email} onChange={(e) => handleInputChange('email', e.target.value)} icon={Mail} type="email" label="Email Address" id="email"/>
                  <ContactField isEditing={isEditing} value={userData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} icon={Phone} type="tel" label="Phone Number" id="phone"/>
                  <ContactField isEditing={isEditing} value={userData.location} onChange={(e) => handleInputChange('location', e.target.value)} icon={MapPin} type="text" label="Location" id="location"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-${color}-500 h-full hover:bg-gray-700 transition-colors`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${color}-400 font-medium text-sm`}>{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
    </div>
);

const ContactField = ({ isEditing, value, onChange, icon: Icon, type, label, id }) => (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-purple-400 flex-shrink-0" aria-hidden="true" />
      {isEditing ? (
        <div className="flex-1">
            <label htmlFor={id} className="sr-only">{label}</label>
            <input id={id} type={type} value={value} onChange={onChange} className="w-full p-2 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"/>
        </div>
      ) : (
        <span className="text-gray-300">{value || 'Not specified'}</span>
      )}
    </div>
);

export default UserProfile;
