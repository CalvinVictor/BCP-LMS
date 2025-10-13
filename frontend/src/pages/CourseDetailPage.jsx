import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player'; // Import the video player
import apiService from '../services/apiService';
import Layout from '../Components/Layout';
import { PlayCircle, Clock, BarChart3, Users, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState(null);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');

  useEffect(() => {
    const fetchCourseAndStatus = async () => {
      if (!courseId) return;
      setIsLoading(true);
      try {
        const [courseData, statusData] = await Promise.all([
          apiService.getCourseById(courseId),
          apiService.getEnrollmentStatus(courseId)
        ]);
        
        setCourse(courseData);
        setIsEnrolled(statusData.isEnrolled);
        
      } catch (err) {
        setError("Failed to load course. It may not be available.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseAndStatus();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const response = await apiService.enrollInCourse(courseId);
      setIsEnrolled(true);
      setEnrollmentMessage(response.message || 'Successfully enrolled!');
    } catch (err) {
      setError(err || 'Enrollment failed. Please try again.');
    }
  };

  const Section = ({ title, children }) => (
    <section className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-8">
      <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
      {children}
    </section>
  );

  const CurriculumModule = ({ module, index }) => {
    const [isOpen, setIsOpen] = useState(index === 0);
    return (
      <div className="border-b border-gray-700 last:border-b-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-5 text-left"
        >
          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isOpen && (
          <ul className="pl-8 pr-5 pb-5 space-y-3">
            <li className="flex items-center text-gray-300">
              <PlayCircle size={16} className="mr-3 text-blue-400" />
              <span>{module.description}</span>
            </li>
            {module.mcqs && module.mcqs.length > 0 && (
                 <li className="flex items-center text-gray-300">
                    <CheckCircle size={16} className="mr-3 text-green-400" />
                    <span>Includes {module.mcqs.length} quiz question(s)</span>
                 </li>
            )}
          </ul>
        )}
      </div>
    );
  };

  if (isLoading) return <Layout><div className="text-center text-white py-20">Loading...</div></Layout>;
  if (error && !course) return <Layout><div className="text-center text-red-400 py-20">{error}</div></Layout>;
  if (!course) return <Layout><div className="text-center text-white py-20">Course not found.</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 text-white">
        <header className="bg-gray-800 rounded-2xl p-8 md:p-12 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">{course.title}</h1>
                    <p className="text-lg text-gray-300 mb-6">Created by <span className="font-semibold text-blue-400">{course.instructor?.username || 'Our Team'}</span></p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 mb-8">
                        <span className="flex items-center"><Clock size={16} className="mr-2"/>{course.duration || 'Self-paced'}</span>
                        <span className="flex items-center"><BarChart3 size={16} className="mr-2"/>{course.level}</span>
                        <span className="flex items-center"><Users size={16} className="mr-2"/>{course.students} students</span>
                    </div>
                </div>
                {/* --- ✅ VIDEO PLAYER SECTION --- */}
               <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <img
                src={course.thumbnail || `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(course.title)}`}
                alt={`Thumbnail for ${course.title}`}
                className="w-full h-full object-cover"
            />
        </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                 <Section title="About This Course">
                    <p className="text-gray-300 whitespace-pre-wrap">{course.description}</p>
                 </Section>
                 <Section title="Course Content">
                    <div className="bg-gray-900/50 rounded-lg border border-gray-700">
                        {course.chapters && course.chapters.length > 0 ? (
                            course.chapters.map((module, index) => (
                                <CurriculumModule key={index} module={module} index={index} />
                            ))
                        ) : (
                            <p className="p-5 text-gray-400">Curriculum details will be available soon.</p>
                        )}
                    </div>
                </Section>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 sticky top-24 mb-8">
                    <div className="p-6">
                        <div className="text-4xl font-bold mb-4">${course.price || 'Free'}</div>
                        
                        {isEnrolled ? (
                            <button 
                                onClick={() => navigate(`/course-player/${courseId}`)}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                            >
                                <PlayCircle className="mr-2" size={24}/>
                                Go to Course
                            </button>
                        ) : (
                            <button 
                                onClick={handleEnroll}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                            >
                                Enroll Now
                            </button>
                        )}
                        
                        {enrollmentMessage && <div className="text-green-400 text-sm mt-4 text-center">{enrollmentMessage}</div>}
                        {error && !isEnrolled && <div className="text-red-400 text-sm mt-4 text-center">{error}</div>}
                    </div>
                </div>
                
                <Section title="Skills You'll Gain">
                  <div className="flex flex-wrap gap-3">
                     <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">{course.category}</span>
                  </div>
                </Section>

                <Section title="Certificate of Completion">
                   <img src="https://placehold.co/600x400/1e293b/ffffff?text=Certificate" alt="Certificate" className="rounded-lg mb-4"/>
                   <p className="text-gray-300">Receive a shareable certificate upon completion to showcase your new skills.</p>
                </Section>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetailPage;
