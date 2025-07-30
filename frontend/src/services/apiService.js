// src/services/apiService.js
import axios from "axios";

// ✅ Base URL for backend
const API_BASE_URL = "http://localhost:5000/api";

// ✅ Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Automatically attach token to all requests
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

// ✅ Global error handler for failed responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(
      error.response?.data?.error || "Something went wrong. Please try again."
    );
  }
);

export default {
  // ✅ Fetch all courses created by this instructor
  fetchInstructorCourses: async () => {
    const { data } = await api.get("/instructor/my-courses");
    return data;
  },

  // ✅ Create a new course
  createCourse: async (courseData) => {
    const { data } = await api.post("/instructor/create-course", courseData);
    return data;
  },

  // ✅ Get instructor dashboard stats
  fetchInstructorStats: async () => {
    const { data } = await api.get("/instructor/stats");
    return data;
  },
  addChapter: async (courseId, chapterData) => {
  const { data } = await api.post(`/courses/${courseId}/add-chapter`, chapterData);
  return data;
},


  // ✅ Publish a course
  publishCourse: async (courseId) => {
    const { data } = await api.put(`/courses/${courseId}/publish`);
    return data;
  },

  fetchPublishedCourses: async () => {
  const response = await api.get("/courses"); // uses GET /api/courses
  return response.data;
},

  // ✅ Login
  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  // ✅ Register
  register: async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    return data;
  },
};
