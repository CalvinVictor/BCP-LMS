import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, LogOut, Play, Clock, Award, Star, ChevronRight, Bell, Search, TrendingUp } from "lucide-react";

const courses = [
  {
    title: "React for Beginners",
    instructor: "Jane Doe",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    progress: 70,
    rating: 4.8,
    students: 1234,
    duration: "12 hours",
    level: "Beginner",
    category: "Frontend"
  },
  {
    title: "Tailwind CSS Mastery",
    instructor: "John Smith",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    progress: 45,
    rating: 4.9,
    students: 892,
    duration: "7 hours",
    level: "Intermediate",
    category: "CSS"
  },
  {
    title: "Fullstack with Node.js",
    instructor: "Alex Ray",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
    progress: 10,
    rating: 4.7,
    students: 2156,
    duration: "12 hours",
    level: "Advanced",
    category: "Backend"
  },
];

const featuredCourses = [
  {
    title: "React Basics",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop",
    instructor: "Sarah Wilson",
    rating: 4.6,
    price: "$49"
  },
  {
    title: "AWS Fundamentals",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    instructor: "Mike Johnson",
    rating: 4.8,
    price: "$69"
  }
];

function Home() {
  const navigate = useNavigate();
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Frontend", "Backend", "CSS", "JavaScript"];

  const filteredCourses = courses.filter(course => 
    (selectedCategory === "All" || course.category === selectedCategory) &&
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LMS Learning
                </h2>
              </div>
              
              {/* Search Bar */}
              <div className="relative ml-8">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200">
                <BookOpen className="w-4 h-4" />
                <span>My Courses</span>
              </button>
              
              <button 
                onClick={() => navigate("/Login")}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome back, Calvin! 👋
                </h1>
                <p className="text-gray-300 text-lg">
                  Ready to continue your learning journey? You're making great progress!
                </p>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">3 courses in progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">2 certificates earned</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Continue Learning Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-400" />
            Continue Learning
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div
                key={index}
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
                  
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Continue Learning</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-400" />
              Featured Courses
            </h3>
            <button className="text-blue-400 hover:text-blue-300 flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {featuredCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;