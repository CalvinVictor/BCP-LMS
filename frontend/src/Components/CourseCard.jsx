import React from "react";
import { Link } from "react-router-dom"; // Step 1: Import the Link component
import { Play, Star, Clock } from "lucide-react";

// The props are slightly simplified as we don't need hover state from the parent anymore
const CourseCard = ({ course, type = "progress" }) => {
  
  // The 'featured' card type
  if (type === "featured") {
    return (
      // Step 2: Wrap the main div in a Link component.
      // The 'to' prop creates the URL, e.g., "/course/60c72b2f9b1e8a5a4c8d9c4a"
      <Link to={`/course/${course._id}`}>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer">
          <div className="flex">
            <img
              src={course.thumbnail || `https://placehold.co/128x128/1a202c/ffffff?text=Course`}
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
                <span className="text-blue-400 font-semibold">${course.price}</span>
              </div>
              {/* This button can still exist for style, but the whole card is now the link */}
              <div className="mt-3 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm text-center">
                View Details
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // The default 'progress' card type
  return (
    // Step 2: Wrap the main div in a Link component here as well.
    <Link to={`/course/${course._id}`}>
      <div
        className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20"
      >
        <div className="relative">
          <img
            src={course.thumbnail || `https://placehold.co/400x200/1a202c/ffffff?text=Course`}
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
            <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>View Course</span>
            </div>
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
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
