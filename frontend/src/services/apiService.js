// src/services/apiService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// --- Attach Token Automatically ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Global Error Handler ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(
      error.response?.data?.message || "Something went wrong. Please try again."
    );
  }
);

// ✅ Combine both axios & fetch-based routes
export default {
  // --- AUTH ROUTES ---
  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },
  register: async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    return data;
  },
  googleLogin: async (payload) => {
    const { data } = await api.post("/auth/google", payload);
    return data;
  },
  forgotPassword: async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },
  resetPassword: async (token, password) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    return data;
  },

  // --- INSTRUCTOR ROUTES ---
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
  getInstructorProfileStats: async () => {
    const { data } = await api.get("/instructor/profile-stats");
    return data;
  },

  // ✅ FETCH-BASED (keep original form for compatibility)
 // --- Add Chapter with video + MCQs ---
addChapter: async (courseId, formData) => {
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/chapters`, { // ✅ URL matches backend
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      // ✅ Do NOT set 'Content-Type', let browser handle multipart/form-data
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add chapter");
  }

  return await res.json();
},


  // --- DELETE CHAPTER (axios-based) ---
  deleteChapter: async (courseId, chapterId) => {
    try {
      const res = await api.delete(`/instructor/${courseId}/chapters/${chapterId}`);
      return res.data;
    } catch (err) {
      console.error("Error deleting chapter:", err.response?.data || err.message);
      throw err;
    }
  },

  publishCourse: async (courseId) => {
    const { data } = await api.put(`/courses/${courseId}/publish`);
    return data;
  },

  // --- USER PROFILE & STATS ROUTES ---
  getUserProfile: async () => {
    const { data } = await api.get("/users/profile");
    return data;
  },
  updateUserProfile: async (profileData) => {
    const { data } = await api.put("/users/profile", profileData);
    return data;
  },
  getMyCompletedCourses: async () => {
    const { data } = await api.get("/users/my-completed-courses");
    return data;
  },
  getHomeStats: async () => {
    const { data } = await api.get("/users/home-stats");
    return data;
  },
  getUserHomeStats: async () => {
    const { data } = await api.get("/users/home-stats");
    return data;
  },

  // --- PUBLIC / STUDENT ROUTES ---
  fetchPublishedCourses: async () => {
    const { data } = await api.get("/courses");
    return data;
  },
  fetchHighlyRatedCourses: async () => {
    const { data } = await api.get("/courses/highly-rated");
    return data;
  },
  getCourseById: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}`);
    return data;
  },

  // --- ENROLLMENT ROUTES ---
  enrollInCourse: async (courseId) => {
    const { data } = await api.post("/enrollments/enroll", { courseId });
    return data;
  },
  getMyEnrolledCourses: async () => {
    const { data } = await api.get("/enrollments/my-courses");
    return data;
  },
  getEnrollmentStatus: async (courseId) => {
    const { data } = await api.get(`/enrollments/status/${courseId}`);
    return data;
  },

  // --- LEARNING ROUTES ---
  getCourseForLearning: async (courseId) => {
    const { data } = await api.get(`/learning/course/${courseId}`);
    return data;
  },
  markChapterAsComplete: async (courseId, chapterId) => {
    const { data } = await api.post("/learning/progress/complete-chapter", {
      courseId,
      chapterId,
    });
    return data;
  },
  markCourseAsComplete: async (courseId) => {
    const { data } = await api.post("/learning/progress/complete-course", { courseId });
    return data;
  },

  // --- QUIZ & LEADERBOARD ROUTES ---
  getQuizForCourse: async (courseId) => {
    // two possible endpoints in your versions, keeping /courses/:id/quiz as default
    try {
      const { data } = await api.get(`/courses/${courseId}/quiz`);
      return data;
    } catch {
      const { data } = await api.get(`/quizzes/course/${courseId}`);
      return data;
    }
  },
  completeQuizAndGenerateCertificate: async (courseId, score) => {
    const { data } = await api.post(`/quizzes/course/${courseId}/complete`, { score });
    return data;
  },
  submitTestResult: async (courseId, resultData) => {
    const { data } = await api.post(`/leaderboard/submit/${courseId}`, resultData);
    return data;
  },
  getLeaderboard: async (courseId) => {
    const { data } = await api.get(`/leaderboard/${courseId}`);
    return data;
  },

  // --- CERTIFICATE ROUTES ---
  verifyCertificate: async (uniqueCode) => {
    const { data } = await api.get(`/certificates/verify/${uniqueCode}`);
    return data;
  },
};
