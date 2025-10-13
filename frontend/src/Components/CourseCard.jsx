import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const CourseCard = ({ course, type = "progress", animationDelay = 0 }) => {
  // Featured card (home page)
  if (type === "featured") {
    return (
      <Link to={`/course/${course._id}`} className="block">
        <div
          className="bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 group hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fade-in-up"
          style={{ animationDelay: `${animationDelay}ms` }}
        >
          <div className="relative">
            <img
              src={course.thumbnail || `https://placehold.co/400x200/1e293b/ffffff?text=${course.title}`}
              alt={course.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {course.category}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-purple-300 transition-colors">
              {course.title}
            </h3>
            <p className="text-slate-400 text-sm mb-3">
              By {course.instructor?.username || 'SJU Faculty'}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Progress card (My Learning page)
  return (
    <Link to={`/course-player/${course._id}`} className="block">
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 group hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="relative">
          <img
            src={course.thumbnail || `https://placehold.co/400x200/1e293b/ffffff?text=Course`}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 text-gray-800 p-3 rounded-full">
              <Play className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white mb-2 truncate">{course.title}</h3>
          <p className="text-slate-400 text-sm mb-3">
            By {course.instructor?.username || 'SJU Faculty'}
          </p>
          {course.progress !== undefined && (
            <div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-slate-400 mt-1">{course.progress}% Complete</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
