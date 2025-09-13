import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import Layout from '../Components/Layout';
import CourseCard from '../Components/CourseCard'; // Re-use your awesome course card
import { GraduationCap } from 'lucide-react';

const MyLearningPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const data = await apiService.getMyEnrolledCourses();
        setEnrolledCourses(data);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  return (
    <Layout>
      <div className="animate-fade-in-down">
        <div className="flex items-center gap-4 mb-8">
            <GraduationCap size={40} className="text-purple-400"/>
            <h1 className="text-4xl font-bold text-white">My Learning</h1>
        </div>
        
        {loading ? (
          <p className="text-slate-300">Loading your courses...</p>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-2">You haven't enrolled in any courses yet.</h2>
            <p className="text-slate-400">Explore our catalog and start your learning journey!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course, index) => (
              <div key={course._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                 {/* Here we can show progress on the card if available */}
                <CourseCard course={course} type="progress"/>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyLearningPage;
