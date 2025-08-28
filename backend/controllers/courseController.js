const Course = require("../models/course");

// @desc   Create a new course
// @route  POST /api/instructor/create-course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, totalVideos } = req.body;

    // ✅ Validate required fields
    if (!title || !description || !category || !level) {
      return res.status(400).json({ error: "Title, description, category, and level are required" });
    }

    // ✅ Ensure instructor from token
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Instructor not authorized" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      level,
      thumbnail: thumbnail || "",       // default empty
      totalVideos: totalVideos || 0,    // default zero
      completedVideos: 0,
      students: 0,
      rating: 0,
      instructor: req.user.id,          // ✅ Fixed to always have ID
      status: "Draft",
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({
      message: "Course created successfully",
      course: savedCourse,
    });
  } catch (err) {
    console.error("Error creating course:", err.message);
    res.status(500).json({ error: "Server error while creating course" });
  }
};

// @desc   Get all courses created by this instructor
// @route  GET /api/instructor/my-courses
exports.getMyCourses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const courses = await Course.find({ instructor: req.user.id });
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err.message);
    res.status(500).json({ error: "Server error while fetching courses" });
  }
};
