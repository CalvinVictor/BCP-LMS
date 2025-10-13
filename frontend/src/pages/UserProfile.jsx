import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, BookOpen, Award, Edit2, Save, GraduationCap, X } from 'lucide-react';
import apiService from '../services/apiService';
import Layout from '../Components/Layout';

// --- Modal for Completed Courses ---
const CompletedCoursesModal = ({ title, courses, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl border border-gray-700 max-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
          <X size={24} />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[60vh] space-y-4">
        {courses.length > 0 ? courses.map(course => (
          <Link key={course._id} to={`/course/${course._id}`} className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
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
          <p className="text-gray-400 text-center py-8">No completed courses yet.</p>
        )}
      </div>
    </div>
  </div>
);

// --- User Profile Component ---
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getUserProfile();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const { user } = await apiService.updateUserProfile(userData);
      setUserData(prev => ({ ...prev, ...user }));
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
      setMessage('Failed to update profile.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInputChange = (field, value) => setUserData(prev => ({ ...prev, [field]: value }));

  const handleViewCompletedCourses = async () => {
    try {
      if (!completedCourses.length) {
        const data = await apiService.getMyCompletedCourses();
        setCompletedCourses(data);
      }
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch completed courses', err);
    }
  };

  if (isLoading) return <Layout><div className="text-center text-white py-20">Loading profile...</div></Layout>;
  if (!userData) return <Layout><div className="text-center text-red-400 py-20">Failed to load profile.</div></Layout>;

  // Only keep completed courses & certificates in stats
  const stats = [
    { title: 'Courses Completed', value: userData.coursesCompleted, icon: BookOpen, action: handleViewCompletedCourses },
    { title: 'Certificates Earned', value: userData.certificatesEarned, icon: Award, action: handleViewCompletedCourses },
  ];

  const contactFields = [
    { label: 'Email Address', value: userData.email, type: 'email', field: 'email', icon: Mail },
    { label: 'Phone Number', value: userData.phone, type: 'tel', field: 'phone', icon: Phone },
    { label: 'Location', value: userData.location, type: 'text', field: 'location', icon: MapPin },
  ];

  return (
    <Layout>
      {showModal && <CompletedCoursesModal title="My Achievements" courses={completedCourses} onClose={() => setShowModal(false)} />}
      <div className="max-w-6xl mx-auto p-4 text-white space-y-6">
        {message && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center">{message}</div>}

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
            <div className="absolute -bottom-16 left-8 z-10 w-32 h-32">
              <div className="w-full h-full bg-gray-700 rounded-full p-1 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-20 pb-6 px-8 flex justify-between items-start">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="text-3xl font-bold text-white bg-gray-700 border-2 border-gray-600 rounded-lg px-3 py-1 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <h1 className="text-3xl font-bold">{userData.username}</h1>
              )}
              <p className="text-purple-400 font-medium mt-1 capitalize">{userData.role}</p>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"><Save size={16}/>Save</button>
                  <button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg">Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"><Edit2 size={16}/>Edit Profile</button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            stat.action ? (
              <button key={idx} onClick={stat.action} className="w-full text-left">
                <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
              </button>
            ) : (
              <StatCard key={idx} title={stat.title} value={stat.value} icon={stat.icon} />
            )
          ))}
        </div>

        {/* About Me & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="About Me" icon={GraduationCap}>
              {isEditing ? (
                <textarea
                  value={userData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full h-32 p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">{userData.bio || 'No bio available.'}</p>
              )}
            </Card>
          </div>
          <div className="space-y-6">
            <Card title="Contact Information">
              {contactFields.map((field, idx) => (
                <ContactField
                  key={idx}
                  isEditing={isEditing}
                  value={field.value || ''}
                  onChange={(e) => handleInputChange(field.field, e.target.value)}
                  icon={field.icon}
                  type={field.type}
                  label={field.label}
                  id={field.field}
                />
              ))}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// --- Reusable Components ---
const StatCard = ({ title, value, icon: Icon, color }) => {
  // Define color gradients based on the type of stat
  const gradients = {
    courses: 'from-purple-600 to-indigo-600',
    certificates: 'from-yellow-500 to-orange-400',
  };

  const borderColors = {
    courses: 'border-purple-500',
    certificates: 'border-yellow-400',
  };

  const textColors = {
    courses: 'text-purple-400',
    certificates: 'text-yellow-400',
  };

  // Determine the gradient & color class based on title
  let grad = gradients.courses, border = borderColors.courses, text = textColors.courses;
  if (title.toLowerCase().includes('certificate')) {
    grad = gradients.certificates;
    border = borderColors.certificates;
    text = textColors.certificates;
  }

  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${border} h-full transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${text} font-medium text-sm`}>{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
          <Icon className="w-8 h-8 text-white"/>
        </div>
      </div>
    </div>
  );
};

const ContactField = ({ isEditing, value, onChange, icon: Icon, type, label, id }) => (
  <div className="flex items-center space-x-3">
    <Icon className="w-5 h-5 text-purple-400 flex-shrink-0" aria-hidden="true"/>
    {isEditing ? (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="flex-1 p-2 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
        placeholder={label}
      />
    ) : (
      <span className="text-gray-300">{value || 'Not specified'}</span>
    )}
  </div>
);

const Card = ({ title, children, icon: Icon }) => (
  <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
    {title && <h2 className="text-xl font-bold mb-4 flex items-center">{Icon && <Icon className="w-5 h-5 mr-2 text-purple-400" />} {title}</h2>}
    {children}
  </div>
);

export default UserProfile;
