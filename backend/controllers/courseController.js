// backend/controllers/courseController.js
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Course = require("../models/course");

/* ----------------------------- Multer setup ----------------------------- */
// Store videos under backend/uploads/videos
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "videos");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/\s+/g, "_");
    const filename = `${Date.now()}_${safeBase}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB
});

/** Middleware for single video upload */
exports.uploadVideo = upload.single("video");

/* --------------------------- Existing endpoints -------------------------- */
// @desc   Create a new course
// @route  POST /api/instructor/create-course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, totalVideos } = req.body;

    if (!title || !description || !category || !level) {
      return res
        .status(400)
        .json({ error: "Title, description, category, and level are required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: "Instructor not authorized" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      level,
      thumbnail: thumbnail || "",
      totalVideos: totalVideos || 0,
      completedVideos: 0,
      students: 0,
      rating: 0,
      instructor: req.user.id,
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
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const courses = await Course.find({ instructor: req.user.id });
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err.message);
    res.status(500).json({ error: "Server error while fetching courses" });
  }
};

/* ------------------------- New: Add chapter+video ------------------------ */
// @desc   Add a chapter with an uploaded video file
// @route  POST /api/instructor/courses/:courseId/chapters
//         (use middleware: uploadVideo)
exports.addChapterWithVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description = "" } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Video file is required (field name: 'video')" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // ✅ Store only relative path (browser can access via express.static)
    const publicRelativePath = `/uploads/videos/${req.file.filename}`;

    course.chapters.push({
      title: title || `Chapter ${course.chapters.length + 1}`,
      description,
      videoURL: publicRelativePath,
    });

    course.totalVideos = course.chapters.length;

    await course.save();

    res.status(201).json({
      message: "Chapter created and video uploaded successfully",
      chapterIndex: course.chapters.length - 1,
      chapter: course.chapters[course.chapters.length - 1],
      courseId: course._id,
    });
  } catch (err) {
    console.error("Error adding chapter with video:", err.message);
    res.status(500).json({ error: "Failed to add chapter with video" });
  }
};
