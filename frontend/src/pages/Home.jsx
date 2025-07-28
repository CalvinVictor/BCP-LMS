import React, { useState } from "react";
import { Clock, Award, ChevronRight } from "lucide-react";
import Layout from "../Components/Layout";
import WelcomeSection from "../Components/WelcomeSection";
import CategoryFilter from "../Components/CategoryFilter";
import CourseCard from "../Components/CourseCard";
import AIChatWidget from "../Components/AIChatWidget";

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
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Frontend", "Backend", "CSS", "JavaScript"];

  const filteredCourses = courses.filter(course => 
    (selectedCategory === "All" || course.category === selectedCategory) &&
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Continue Learning Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-400" />
          Continue Learning
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={index}
              course={course}
              index={index}
              hoveredCourse={hoveredCourse}
              setHoveredCourse={setHoveredCourse}
              type="progress"
            />
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
            <CourseCard
              key={index}
              course={course}
              index={index}
              type="featured"
            />
          ))}
        </div>
      </section>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </Layout>
  );
}

export default Home;