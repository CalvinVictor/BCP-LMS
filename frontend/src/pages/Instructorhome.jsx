import React, { useState, useEffect } from "react";
import {
  Clock,
  Award,
  Plus,
  Users,
  BarChart3,
  Upload,
  BookOpen,
} from "lucide-react";
import Layout from "../Components/Layout";
import CategoryFilter from "../Components/CategoryFilter";
import apiService from "../services/apiService";

function InstructorDashboard() {
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    thumbnail: "",
    totalVideos: 0,
  });

  const [newChapter, setNewChapter] = useState({
    title: "",
    description: "",
    videoURL: "",
    materials: [""],
    mcqs: [
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ],
  });

  const categories = ["All", "Frontend", "Backend", "CSS", "JavaScript"];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchInstructorCourses();
      setInstructorCourses(data);
    } catch (err) {
      setError("Could not load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = instructorCourses.filter(
    (course) =>
      (selectedCategory === "All" || course.category === selectedCategory) &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCourseSubmit = async () => {
    try {
      const courseData = {
        ...newCourse,
        totalVideos: parseInt(newCourse.totalVideos, 10),
      };

      await apiService.createCourse(courseData);
      await fetchCourses();

      setShowAddCourseModal(false);
      setNewCourse({
        title: "",
        description: "",
        category: "",
        level: "Beginner",
        thumbnail: "",
        totalVideos: 0,
      });
    } catch (err) {
      alert("❌ Failed to create course.");
    }
  };

  const handlePublishCourse = async (courseId) => {
    try {
      await apiService.publishCourse(courseId);
      await fetchCourses();
      alert("✅ Course published successfully!");
    } catch (err) {
      alert("❌ Failed to publish course.");
    }
  };

  const openAddChapterModal = (courseId) => {
    setSelectedCourseId(courseId);
    setShowAddChapterModal(true);
  };

const handleAddChapter = async () => {
  try {
    const formData = new FormData();
    formData.append("title", newChapter.title);
    formData.append("description", newChapter.description);
    if (newChapter.videoFile) {
      formData.append("video", newChapter.videoFile);
    }

    await apiService.addChapter(selectedCourseId, formData);
    await fetchCourses();
    alert("✅ Chapter added successfully!");

    setShowAddChapterModal(false);
    setNewChapter({
      title: "",
      description: "",
      videoFile: null,
      materials: [""],
      mcqs: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
    });
  } catch (err) {
    alert("❌ Failed to add chapter.");
  }
};

  const handleMCQChange = (index, field, value) => {
    const updatedMCQs = [...newChapter.mcqs];
    if (field === "options") {
      updatedMCQs[index].options = value;
    } else {
      updatedMCQs[index][field] = value;
    }
    setNewChapter({ ...newChapter, mcqs: updatedMCQs });
  };

  const addMCQ = () => {
    setNewChapter({
      ...newChapter,
      mcqs: [...newChapter.mcqs, { question: "", options: ["", "", "", ""], correctAnswer: "" }],
    });
  };

  const removeMCQ = (index) => {
    const updatedMCQs = newChapter.mcqs.filter((_, i) => i !== index);
    setNewChapter({ ...newChapter, mcqs: updatedMCQs });
  };

  return (
    <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Instructor!</h1>
            <p className="text-blue-100 mb-4">
              Manage your courses, track student progress, and create content
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>
                  {instructorCourses.reduce((acc, c) => acc + c.students, 0)} Students
                </span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                <span>
                  {instructorCourses.length > 0
                    ? (
                        instructorCourses.reduce((acc, c) => acc + c.rating, 0) /
                        instructorCourses.length
                      ).toFixed(1)
                    : 0} ⭐ Avg Rating
                </span>
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

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-400" />
          My Courses
        </h2>

        {loading ? (
          <p className="text-white">Loading courses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-gray-400">No courses found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-800 rounded-xl p-4 shadow-md text-white flex flex-col justify-between"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="rounded-xl w-full h-40 object-cover mb-4"
                />
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-300 mb-1">{course.category}</p>
                  <p className="text-sm text-gray-400">{course.level}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openAddChapterModal(course._id)}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center text-sm"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add Content
                  </button>

                  <button
                    onClick={() => handlePublishCourse(course._id)}
                    className={`bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center text-sm ${
                      course.status === "Published" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={course.status === "Published"}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {course.status === "Published" ? "Published" : "Publish"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* ✅ Add Course Modal */}
{showAddCourseModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-lg">
      <h3 className="text-xl font-bold text-white mb-4">Create New Course</h3>

      <input
        type="text"
        placeholder="Course Title"
        value={newCourse.title}
        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
      />
      <textarea
        placeholder="Description"
        value={newCourse.description}
        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
      ></textarea>
      <input
        type="text"
        placeholder="Category"
        value={newCourse.category}
        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Thumbnail URL"
        value={newCourse.thumbnail}
        onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
      />
      <input
        type="number"
        placeholder="Total Videos"
        value={newCourse.totalVideos}
        onChange={(e) => setNewCourse({ ...newCourse, totalVideos: e.target.value })}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
      />

      <div className="flex gap-4">
        <button
          onClick={() => setShowAddCourseModal(false)}
          className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleCourseSubmit}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}


      {showAddChapterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-white mb-4">Add Chapter</h3>

            <input
              type="text"
              placeholder="Chapter Title"
              value={newChapter.title}
              onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
              className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
            />
            <textarea
              placeholder="Description"
              value={newChapter.description}
              onChange={(e) =>
                setNewChapter({ ...newChapter, description: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
            ></textarea>
           <input
  type="file"
  accept="video/*"
  onChange={(e) =>
    setNewChapter({ ...newChapter, videoFile: e.target.files[0] })
  }
  className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-700 text-white"
/>


            {/* MCQ Section */}
            <h4 className="text-lg font-semibold text-white mt-4">Add MCQs</h4>
            {newChapter.mcqs.map((mcq, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded-lg mb-3">
                <input
                  type="text"
                  placeholder="Question"
                  value={mcq.question}
                  onChange={(e) => handleMCQChange(index, "question", e.target.value)}
                  className="w-full mb-2 px-3 py-2 rounded bg-gray-600 text-white"
                />
                {mcq.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updatedOptions = [...mcq.options];
                      updatedOptions[i] = e.target.value;
                      handleMCQChange(index, "options", updatedOptions);
                    }}
                    className="w-full mb-2 px-3 py-2 rounded bg-gray-600 text-white"
                  />
                ))}
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={mcq.correctAnswer}
                  onChange={(e) => handleMCQChange(index, "correctAnswer", e.target.value)}
                  className="w-full mb-2 px-3 py-2 rounded bg-gray-600 text-white"
                />
                <button
                  onClick={() => removeMCQ(index)}
                  className="bg-red-600 px-3 py-1 text-white rounded hover:bg-red-700 text-sm"
                >
                  Remove MCQ
                </button>
              </div>
            ))}
            <button
              onClick={addMCQ}
              className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700 mb-4"
            >
              + Add Another MCQ
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAddChapterModal(false)}
                className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChapter}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
              >
                Add Chapter
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default InstructorDashboard;
