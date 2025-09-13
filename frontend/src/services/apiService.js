// src/services/apiService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


const api = axios.create({
  baseURL: API_BASE_URL,
});
// Delete a chapter
async function deleteChapter(courseId, chapterId) {
  try {
    const res = await api.delete(`/instructor/${courseId}/chapters/${chapterId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting chapter:", err.response?.data || err.message);
    throw err;
  }
}


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
addChapter: async (courseId, formData) => {
  const res = await fetch(`${API_BASE_URL}/instructor/${courseId}/add-chapter`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData, // ✅ don't stringify
  });
  if (!res.ok) throw new Error("Failed to add chapter");
  return await res.json();
},
  deleteChapter, 

  publishCourse: async (courseId) => {
    const { data } = await api.put(`/courses/${courseId}/publish`);
    return data;
  },

  // --- User Profile Routes ---
  getUserProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },
  updateUserProfile: async (profileData) => {
    const { data } = await api.put('/users/profile', profileData);
    return data;
  },
  getMyCompletedCourses: async () => {
    const { data } = await api.get('/users/my-completed-courses');
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

   submitTestResult: async (courseId, resultData) => {
  // 'resultData' is the object { score: 1200, timeTaken: 7 }
  // We pass it directly to the backend.
  const { data } = await api.post(`/leaderboard/submit/${courseId}`, resultData);
  return data;
},
  
 getLeaderboard: async (courseId) => {
    const { data } = await api.get(`/leaderboard/${courseId}`);
    return data;
 }, 

 // --- New Function for Home Page Stats ---
getUserHomeStats: async () => {
  const { data } = await api.get('/users/home-stats');
  return data;
},

  getHomeStats: async () => {
    const { data } = await api.get('/users/home-stats');
    return data;
  },

  

};