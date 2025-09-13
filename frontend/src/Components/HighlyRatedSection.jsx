// In frontend/src/Components/HighlyRatedSection.jsx
import React, { useState, useEffect } from 'react';
import { ParallaxBanner } from 'react-scroll-parallax';
import apiService from '../services/apiService';
import CourseCard from './CourseCard';
import { Star } from 'lucide-react';

const HighlyRatedSection = () => {
  const [ratedCourses, setRatedCourses] = useState([]);

  useEffect(() => {
    const fetchRatedCourses = async () => {
      try {
        // You'll need to add 'fetchHighlyRatedCourses' to your apiService.js
        const data = await apiService.fetchHighlyRatedCourses();
        setRatedCourses(data);
      } catch (error) {
        console.error("Failed to fetch highly rated courses:", error);
      }
    };
    fetchRatedCourses();
  }, []);

  if (ratedCourses.length === 0) return null;

  return (
    <ParallaxBanner
      layers={[{ image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=1400&h=800&q=80', speed: -20 }]}
      className="aspect-[2/1] md:aspect-[3/1] rounded-2xl my-16"
    >
      <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center text-white p-8">
        <Star className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-4xl font-bold mb-8">Highly Rated Courses</h2>
        <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {ratedCourses.map((course, index) => (
                    <CourseCard key={course._id} course={course} type="featured"/>
                ))}
            </div>
        </div>
      </div>
    </ParallaxBanner>
  );
};

export default HighlyRatedSection;