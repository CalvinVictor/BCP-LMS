import React, { useState, useEffect } from "react";
import { Clock, Award, ChevronRight } from "lucide-react";
import Layout from "../Components/Layout";
import WelcomeSection from "../Components/WelcomeSection";
import CourseCard from "../Components/CourseCard";
import CategoryFilter from "../Components/CategoryFilter";
import apiService from "../services/apiService"; // ✅ Import API service
import AIChatWidget from "../Components/AIChatWidget";

function Home() {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState([]); // ✅ Dynamic courses
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Frontend", "Backend", "CSS", "JavaScript"];

  // ✅ Fetch published courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await apiService.fetchPublishedCourses(); // ✅ New API call
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
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

      {/* Published Courses */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-400" />
          Available Courses
        </h2>

        {loading ? (
          <p className="text-white">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-gray-400">No published courses available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course._id || index}
                course={course}
                index={index}
                hoveredCourse={hoveredCourse}
                setHoveredCourse={setHoveredCourse}
                type="featured"
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Section Removed since we're fetching live data */}

      {/* AI Chat Widget */}
      <AIChatWidget />
    </Layout>
  );
}

export default Home;
