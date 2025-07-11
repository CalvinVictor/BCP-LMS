import React from "react";
import { Play, Star, Clock } from "lucide-react";

const CourseCard = ({ course, index, hoveredCourse, setHoveredCourse, type = "progress" }) => {
  if (type === "featured") {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer">
        <div className="flex">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-32 h-32 object-cover"
          />
          <div className="p-6 flex-1">
            <h4 className="text-lg font-semibold text-white mb-2">{course.title}</h4>
            <p className="text-gray-300 text-sm mb-2">By {course.instructor}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-gray-300 text-sm">{course.rating}</span>
              </div>
              <span className="text-blue-400 font-semibold">{course.price}</span>
            </div>
            <button className="mt-3 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-blue-700 transition-all duration-200">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
        hoveredCourse === index ? 'shadow-2xl shadow-blue-500/20' : ''
      }`}
      onMouseEnter={() => setHoveredCourse(index)}
      onMouseLeave={() => setHoveredCourse(null)}
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.level === 'Beginner' ? 'bg-green-500 text-white' :
            course.level === 'Intermediate' ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {course.level}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white transition-colors">
            <Play className="w-4 h-4" />
            <span>Continue</span>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
        <p className="text-gray-300 mb-3">By {course.instructor}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-gray-300 text-sm">{course.rating}</span>
            <span className="text-gray-500 text-sm">({course.students})</span>
          </div>
          <span className="text-gray-300 text-sm">{course.duration}</span>
        </div>
        
        {course.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm">Progress</span>
              <span className="text-blue-400 text-sm font-medium">{course.progress}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2">
          <Play className="w-4 h-4" />
          <span>{course.progress !== undefined ? 'Continue Learning' : 'Start Learning'}</span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;