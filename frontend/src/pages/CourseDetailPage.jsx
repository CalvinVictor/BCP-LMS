import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/apiService'; // Adjust path if you moved the services folder
import Layout from '../Components/Layout';
import { Clock, BarChart3, Users, CheckCircle } from 'lucide-react';

function CourseDetailPage() {
  const { courseId } = useParams(); // Gets course ID from the URL, e.g., /course/12345
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState('');
  const [enrollmentMessage, setEnrollmentMessage] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true);
      try {
        // You need an endpoint to get a single course's details.
        // Let's add this to courseRoutes.js later if it doesn't exist.
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);

        // TODO: Check if the user is already enrolled in this course.
        // This could be done by fetching '/api/enrollments/my-courses' and checking if courseId is present.

      } catch (err) {
        console.error("Failed to fetch course details:", err);
        setError("Could not load the course. It may not exist or may not be published.");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const response = await api.post('/enrollments/enroll', { courseId });
      setIsEnrolled(true);
      setEnrollmentMessage('Successfully enrolled! You can start learning now.');
    } catch (err) {
      console.error("Enrollment failed:", err);
      setError(err.response?.data?.message || 'Enrollment failed. You may already be enrolled or an error occurred.');
    }
  };

  if (isLoading) {
    return <Layout><div className="text-white text-center p-10">Loading Course Details...</div></Layout>;
  }

  if (error && !course) {
    return <Layout><div className="text-red-400 text-center p-10">{error}</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Course Details */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-300 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>Created by {course.instructorName || 'Instructor'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>{course.duration || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 size={20} />
                <span>{course.level || 'All Levels'}</span>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-blue-400"/><span>Core concepts of the technology.</span></li>
                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-blue-400"/><span>How to build real-world applications.</span></li>
                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-blue-400"/><span>Advanced tips and tricks.</span></li>
                </ul>
            </div>
          </div>

          {/* Right Side: Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 sticky top-24">
              <img 
                src={course.thumbnail || `https://placehold.co/600x400/1a202c/ffffff?text=Course`} 
                alt={course.title} 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <div className="text-4xl font-bold mb-4">${course.price || 'Free'}</div>
                
                {isEnrolled ? (
                  <div className="text-center p-3 bg-green-500 bg-opacity-20 text-green-300 rounded-lg">
                    {enrollmentMessage}
                  </div>
                ) : (
                  <button 
                    onClick={handleEnroll}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                  >
                    Enroll Now
                  </button>
                )}
                
                {error && !isEnrolled && <div className="text-red-400 text-sm mt-4 text-center">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CourseDetailPage;
