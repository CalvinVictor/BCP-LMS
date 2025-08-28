// src/services/apiService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(
      error.response?.data?.message || "Something went wrong. Please try again."
    );
  }
);

export default {
  // --- Auth Routes ---
  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },
  register: async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    return data;
  },

  // --- Instructor Routes ---
  fetchInstructorCourses: async () => {
    const { data } = await api.get("/instructor/my-courses");
    return data;
  },
  createCourse: async (courseData) => {
    const { data } = await api.post("/courses", courseData);
    return data;
  },
  fetchInstructorStats: async () => {
    const { data } = await api.get("/instructor/stats");
    return data;
  },
  addChapter: async (courseId, chapterData) => {
    const { data } = await api.post(`/courses/${courseId}/chapters`, chapterData);
    return data;
  },
  publishCourse: async (courseId) => {
    const { data } = await api.put(`/courses/${courseId}/publish`);
    return data;
  },

  // --- Public/Student Routes ---
  fetchPublishedCourses: async () => {
    const { data } = await api.get("/courses");
    return data;
  },
  
  // ✅ THIS IS THE MISSING FUNCTION THAT FIXES THE BUG
  getCourseById: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}`);
    return data;
  },
// --- Enrollment Routes ---
enrollInCourse: async (courseId) => {
  const { data } = await api.post('/enrollments/enroll', { courseId });
  return data;
},

getMyEnrolledCourses: async () => {
  const { data } = await api.get('/enrollments/my-courses');
  return data;
},

getEnrollmentStatus: async (courseId) => {
  const { data } = await api.get(`/enrollments/status/${courseId}`);
  return data;
},

// --- Learning Routes ---
getCourseForLearning: async (courseId) => {
  const { data } = await api.get(`/learning/course/${courseId}`);
  return data;
},

markChapterAsComplete: async (courseId, chapterId) => {
  const { data } = await api.post('/learning/progress/complete-chapter', { courseId, chapterId });
  return data;
},

// --- Learning Routes ---
markCourseAsComplete: async (courseId) => {
  const { data } = await api.post('/learning/progress/complete-course', { courseId });
  return data;
},
//--- quiz page da---
getQuizForCourse: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}/quiz`);
    return data;
  },

};