// api/apiService.js - Centralized API service for your React app

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear auth token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Auth Methods
  async register(userData) {
    const response = await this.apiCall('/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.apiCall('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // User Management (Admin)
  async getAllUsers() {
    return this.apiCall('/admin/users');
  }

  async deleteUser(userId) {
    return this.apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async toggleUserStatus(userId) {
    return this.apiCall(`/admin/users/${userId}/toggle`, {
      method: 'PUT',
    });
  }

  // Course Management
  async getAllCourses() {
    return this.apiCall('/admin/courses');
  }

  async createCourse(courseData) {
    return this.apiCall('/admin/courses', {
      method: 'POST',
      body: courseData,
    });
  }

  async deleteCourse(courseId) {
    return this.apiCall(`/admin/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  async toggleCourseStatus(courseId) {
    return this.apiCall(`/admin/courses/${courseId}/toggle`, {
      method: 'PUT',
    });
  }

  // Test protected route
  async testProtected() {
    return this.apiCall('/auth/protected');
  }
}

export default new ApiService();