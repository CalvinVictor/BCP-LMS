import React from "react";
import { Link } from "react-router-dom";
import { Play, Star, Users } from "lucide-react";

const CourseCard = ({ course, style }) => {
  // We accept a 'style' prop now for the animation delay
  return (
    <Link to={`/course/${course._id}`} className="block" style={style}>
      <div className="h-full bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 
                      transition-all duration-300 transform hover:-translate-y-2 
                      hover:shadow-2xl hover:shadow-purple-500/40 hover:border-purple-500/50 
                      cursor-pointer flex flex-col">
        
        <div className="relative">
          <img
            src={course.thumbnail || `https://placehold.co/400x200/1e293b/ffffff?text=${course.title}`}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 font-semibold">
              <Play className="w-5 h-5" />
              <span>View Course</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
          <p className="text-sm text-purple-400 font-semibold mb-1">{course.category}</p>
          <h3 className="text-xl font-bold text-white mb-2 flex-grow">{course.title}</h3>
          
          <div className="flex items-center text-gray-400 text-sm mt-auto pt-4 border-t border-slate-700/50">
            <Users size={16} className="mr-2" />
            <span>{course.students || 0} students</span>
            <span className="mx-2">•</span>
            <Star size={16} className="mr-1 text-yellow-400" />
            <span>{course.rating || 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;