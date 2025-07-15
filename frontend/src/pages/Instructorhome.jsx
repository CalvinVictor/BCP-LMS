import React, { useState } from "react";
import { 
  Clock, 
  Award, 
  ChevronRight, 
  Plus, 
  Video, 
  FileText, 
  Users, 
  BarChart3,
  Edit,
  Upload
} from "lucide-react";
import Layout from "../Components/Layout";
import WelcomeSection from "../Components/WelcomeSection";
import CategoryFilter from "../Components/CategoryFilter";
import CourseCard from "../Components/CourseCard";

const instructorCourses = [
  {
    title: "React for Beginners",
    instructor: "You",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    progress: 85, // Course completion percentage
    rating: 4.8,
    students: 1234,
    duration: "12 hours",
    level: "Beginner",
    category: "Frontend",
    status: "Published",
    totalVideos: 24,
    completedVideos: 20
  },
  {
    title: "Advanced JavaScript Concepts",
    instructor: "You",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    progress: 60,
    rating: 4.9,
    students: 892,
    duration: "15 hours",
    level: "Advanced",
    category: "JavaScript",
    status: "Draft",
    totalVideos: 18,
    completedVideos: 11
  },
  {
    title: "Fullstack Development",
    instructor: "You",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
    progress: 30,
    rating: 4.7,
    students: 2156,
    duration: "20 hours",
    level: "Intermediate",
    category: "Backend",
    status: "In Progress",
    totalVideos: 32,
    completedVideos: 10
  },
];

const recentActivities = [
  {
    type: "video",
    title: "New video uploaded to React for Beginners",
    time: "2 hours ago",
    course: "React for Beginners"
  },
  {
    type: "student",
    title: "15 new students enrolled in Advanced JavaScript",
    time: "5 hours ago",
    course: "Advanced JavaScript Concepts"
  },
  {
    type: "content",
    title: "Course content updated for Fullstack Development",
    time: "1 day ago",
    course: "Fullstack Development"
  }
];

function InstructorDashboard() {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const categories = ["All", "Frontend", "Backend", "CSS", "JavaScript"];

  const filteredCourses = instructorCourses.filter(course => 
    (selectedCategory === "All" || course.category === selectedCategory) &&
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContent = (course) => {
    setSelectedCourse(course);
    // This would typically open a modal or navigate to content management page
    console.log("Adding content to:", course.title);
  };

  const InstructorWelcomeSection = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, Instructor!</h1>
          <p className="text-blue-100 mb-4">
            Manage your courses, track student progress, and create engaging content
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>3,282 Total Students</span>
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              <span>4.8 Avg Rating</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span>$12,450 This Month</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowAddCourseModal(true)}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center mt-4 md:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Course
        </button>
      </div>
    </div>
  );

  const InstructorCourseCard = ({ course, index }) => (
    <div 
      className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 border border-gray-700"
      onMouseEnter={() => setHoveredCourse(index)}
      onMouseLeave={() => setHoveredCourse(null)}
    >
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.status === 'Published' ? 'bg-green-500 text-white' :
            course.status === 'Draft' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
          }`}>
            {course.status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <Users className="w-4 h-4 mr-1" />
          <span>{course.students} students</span>
          <span className="mx-2">•</span>
          <span>{course.rating} ⭐</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Content Progress</span>
            <span>{course.completedVideos}/{course.totalVideos} videos</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(course.completedVideos / course.totalVideos) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => handleAddContent(course)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
          >
            <Video className="w-4 h-4 mr-2" />
            Add Content
          </button>
          <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center">
            <Edit className="w-4 h-4" />
          </button>
          <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      {/* Welcome Section */}
      <InstructorWelcomeSection />

      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* My Courses Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-400" />
          My Courses
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <InstructorCourseCard
              key={index}
              course={course}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-400" />
            Recent Activity
          </h3>
          <button className="text-blue-400 hover:text-blue-300 flex items-center space-x-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-750 rounded-lg">
                <div className="flex-shrink-0 mr-4">
                  {activity.type === 'video' && <Video className="w-5 h-5 text-blue-400" />}
                  {activity.type === 'student' && <Users className="w-5 h-5 text-green-400" />}
                  {activity.type === 'content' && <FileText className="w-5 h-5 text-yellow-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-gray-400 text-sm">{activity.course} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Plus className="w-6 h-6 mr-2 text-purple-400" />
          Quick Actions
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl text-white hover:from-blue-700 hover:to-blue-800 transition-all">
            <Video className="w-8 h-8 mb-3" />
            <h4 className="font-semibold mb-2">Upload Video</h4>
            <p className="text-sm text-blue-100">Add new video content</p>
          </button>
          <button className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl text-white hover:from-green-700 hover:to-green-800 transition-all">
            <FileText className="w-8 h-8 mb-3" />
            <h4 className="font-semibold mb-2">Create Quiz</h4>
            <p className="text-sm text-green-100">Build interactive quizzes</p>
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-xl text-white hover:from-purple-700 hover:to-purple-800 transition-all">
            <Upload className="w-8 h-8 mb-3" />
            <h4 className="font-semibold mb-2">Upload Resources</h4>
            <p className="text-sm text-purple-100">Add downloadable files</p>
          </button>
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-xl text-white hover:from-orange-700 hover:to-orange-800 transition-all">
            <BarChart3 className="w-8 h-8 mb-3" />
            <h4 className="font-semibold mb-2">View Analytics</h4>
            <p className="text-sm text-orange-100">Track course performance</p>
          </button>
        </div>
      </section>

      {/* Add Course Modal - Simple placeholder */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl w-96 max-w-90vw">
            <h3 className="text-xl font-bold text-white mb-4">Create New Course</h3>
            <p className="text-gray-400 mb-6">Course creation form would go here...</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default InstructorDashboard;