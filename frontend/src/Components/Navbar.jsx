import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, Search, Menu, X, GraduationCap } from 'lucide-react';
import apiService from '../services/apiService';

// SJU Logo SVG Component
const SjuLogo = () => (
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 11.5L4.5 10.25l7.5 3.75 7.5-3.75L12 13.5zm0 3L4.5 12.75l7.5 3.75 7.5-3.75L12 16.5z"/>
        <path d="M2 17l10 5 10-5-10-5-10 5z"/>
    </svg>
);

const Navbar = ({ searchTerm, setSearchTerm, showSearch = true }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMyLearningOpen, setIsMyLearningOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const myLearningRef = useRef(null);

  // Fetch enrolled courses for the dropdown
  useEffect(() => {
    if (localStorage.getItem('token')) {
        const fetchEnrolled = async () => {
            try {
                const courses = await apiService.getMyEnrolledCourses();
                setEnrolledCourses(courses);
            } catch (error) {
                console.error("Failed to fetch enrolled courses:", error);
            }
        };
        fetchEnrolled();
    }
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (myLearningRef.current && !myLearningRef.current.contains(event.target)) {
        setIsMyLearningOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/home" className="flex items-center space-x-3">
            <SjuLogo />
            <h1 className="text-2xl font-bold text-white tracking-wide">
              St. Joseph's University
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {showSearch && (
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
            )}
            <Link to="/profile" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg">
              <User size={18} /><span>Profile</span>
            </Link>
            
            {/* My Learning Dropdown */}
            <div className="relative" ref={myLearningRef}>
                <button 
                    onClick={() => setIsMyLearningOpen(!isMyLearningOpen)}
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg"
                >
                    <GraduationCap size={18} /><span>My Learning</span>
                </button>
                {isMyLearningOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-lg animate-fade-in-down py-2">
                        {enrolledCourses.length > 0 ? (
                            enrolledCourses.map(course => (
                                <Link
                                    key={course._id}
                                    to={`/course-player/${course._id}`}
                                    onClick={() => setIsMyLearningOpen(false)}
                                    className="flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-slate-700"
                                >
                                    <img src={course.thumbnail || 'https://placehold.co/40x40'} alt={course.title} className="w-10 h-10 rounded-md object-cover mr-3"/>
                                    <span className="font-semibold">{course.title}</span>
                                </Link>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-400">You are not enrolled in any courses.</div>
                        )}
                    </div>
                )}
            </div>

            <button onClick={handleLogout} className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <LogOut size={16} /><span>Logout</span>
            </button>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/80 backdrop-blur-lg pb-4 px-4 space-y-4">
          {showSearch && (
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            )}
          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 text-slate-200 hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium">
            <User size={20} /><span>Profile</span>
          </Link>
          <Link to="/my-learning" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 text-slate-200 hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium">
            <GraduationCap size={20} /><span>My Learning</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-3 bg-purple-600 text-white px-3 py-3 rounded-md text-base font-medium">
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;