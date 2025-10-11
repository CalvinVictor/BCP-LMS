import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import api from '../services/axiosConfig';
import apiService from "../services/apiService";

import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  BarChart3, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  LogOut,
  UserCheck,
  UserX,
  Book,
  Award,
  Bell,
  Filter,
  Download,
  Upload,
  ChevronDown,
  X
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalStudents: 0
  });
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "student" });
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    category: "",
    duration: "",
    level: "",
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [userFilter, setUserFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  // Vanta Background (Consolidated from two useEffects)
  useEffect(() => {
    const effect = NET({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      color: 0x636611,
      backgroundColor: 0x1127,
      points: 12.0,
      maxDistance: 25.0,
      spacing: 19.0,
    });
    return () => effect.destroy();
  }, []);

  // Initialize data (Consolidated and simplified)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use Promise.all to run all API calls in parallel for speed
        const [statsRes, usersRes, coursesRes] = await Promise.all([
          api.get('/admin/stats'),    // 1. Efficiently get all counts
          api.get('/admin/users'),    // 2. Get the full user list
          api.get('/admin/courses')   // 3. Get the full course list
        ]);

        // Set all your state from the responses
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setFilteredUsers(usersRes.data); // Initialize filtered list
        setCourses(coursesRes.data);
        setFilteredCourses(coursesRes.data); // Initialize filtered list
        
        // Populate instructors state based on fetched users (prevents extra API call on tab switch)
        const allInstructors = usersRes.data.filter(user => user.role === 'instructor');
        setInstructors(allInstructors);

      } catch (error) {
        console.error("Error fetching data:", error);
        showMessage(error.response?.data?.error || "Error loading initial data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 
  
  // NOTE: REMOVED REDUNDANT useEffects and loadUsers/loadCourses functions here.

  // Filter users
  useEffect(() => {
    let filtered = users;
    if (userFilter !== "all") {
      filtered = filtered.filter(user => user.role === userFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  }, [users, userFilter, searchTerm]);

  // Filter courses
  useEffect(() => {
    let filtered = courses;
    // NOTE: courseFilter in UI is based on 'status' ('active'/'draft'), not 'all'
    if (courseFilter !== "all") {
      filtered = filtered.filter(course => course.status === courseFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [courses, courseFilter, searchTerm]);

  // Show message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };
  
  // Handle user actions - FIXED to use _id
  const handleUserAction = async (action, userId) => {
    setIsLoading(true);
    try {
      if (action === 'delete') {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId)); // Use _id
        showMessage("User deleted successfully", "success");
      } else if (action === 'toggle-status') {
        const res = await api.put(`/admin/users/${userId}/toggle`);
        setUsers(users.map(user => (user._id === userId ? res.data.user : user))); // Use _id
        showMessage("User status updated", "success");
      }
    } catch (error) {
      showMessage(error.response?.data?.error || "Action failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle course actions - FIXED to use _id and add API calls
  const handleCourseAction = async (action, courseId) => {
    setIsLoading(true);
    try {
      if (action === "delete") {
        await api.delete(`/admin/courses/${courseId}`); // <<< API CALL ADDED
        setCourses(courses.filter(course => course._id !== courseId)); // Use _id
        showMessage("Course deleted successfully", "success");
      } else if (action === "toggle-status") {
        const res = await api.put(`/admin/courses/${courseId}/toggle`); // <<< API CALL ADDED
        setCourses(courses.map(course => 
          course._id === courseId 
            ? res.data.course // Use the returned course object
            : course
        ));
        showMessage("Course status updated", "success");
      }
    } catch (error) {
      showMessage(error.response?.data?.error || "Action failed", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  // NOTE: Removed redundant handleAddCourse, handleDelete, and handleToggleCourse

  // Open modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedItem(null);
  };


  // Modal component
  const Modal = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white border-opacity-20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  // Stats cards
  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-xl p-6 border border-white border-opacity-20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  // Tab navigation
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "instructors", label: "Instructors", icon: GraduationCap },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      <div ref={vantaRef} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="bg-white bg-opacity-5 backdrop-blur-xl border-b border-white border-opacity-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className="w-64 bg-white bg-opacity-5 backdrop-blur-xl border-r border-white border-opacity-10 min-h-screen p-4">
            <div className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-purple-500 bg-opacity-20 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Message */}
            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === "success" 
                  ? "bg-green-500 bg-opacity-20 text-green-300 border border-green-500 border-opacity-30" 
                  : "bg-red-500 bg-opacity-20 text-red-300 border border-red-500 border-opacity-30"
              }`}>
                {message.text}
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
                  <StatsCard title="Total Courses" value={stats.totalCourses} icon={BookOpen} color="text-green-400" />
                  <StatsCard title="Instructors" value={stats.instructors} icon={GraduationCap} color="text-purple-400" />
                  <StatsCard title="Students" value={stats.students} icon={Award} color="text-yellow-400" />
                </div>

                <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-xl p-6 border border-white border-opacity-20">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-5 rounded-lg">
                      <UserCheck className="text-green-400" size={20} />
                      <span className="text-gray-300">New user registered: {users.length > 0 ? users[users.length - 1].username : 'N/A'}</span>
                      <span className="text-gray-500 text-sm ml-auto">Recently</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-5 rounded-lg">
                      <Book className="text-blue-400" size={20} />
                      <span className="text-gray-300">Course published: Advanced JavaScript</span>
                      <span className="text-gray-500 text-sm ml-auto">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-5 rounded-lg">
                      <GraduationCap className="text-purple-400" size={20} />
                      <span className="text-gray-300">New instructor approved: Alice Brown</span>
                      <span className="text-gray-500 text-sm ml-auto">6 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">User Management</h2>
                  <div className="flex items-center space-x-3">
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-4 py-2 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Users</option>
                      <option value="student">Students</option>
                      <option value="instructor">Instructors</option>
                    </select>
                   
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-xl border border-white border-opacity-20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white bg-opacity-5">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white divide-opacity-10">
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-white hover:bg-opacity-5">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-white">{user.username}</div>
                                <div className="text-sm text-gray-400">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === "instructor" 
                                  ? "bg-purple-500 bg-opacity-20 text-purple-300"
                                  : user.role === "admin"
                                  ? "bg-red-500 bg-opacity-20 text-red-300"
                                  : "bg-blue-500 bg-opacity-20 text-blue-300"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.status === "active" 
                                  ? "bg-green-500 bg-opacity-20 text-green-300"
                                  : "bg-red-500 bg-opacity-20 text-red-300"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                           <td className="px-6 py-4">
  <button 
    onClick={() => handleUserAction("delete", user._id)}
    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
    disabled={isLoading}
  >
    <Trash2 size={16} />
  </button>
</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Course Management</h2>
                  <div className="flex items-center space-x-3">
                    <select
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                      className="px-4 py-2 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Courses</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-xl border border-white border-opacity-20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white bg-opacity-5">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Instructor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Students</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white divide-opacity-10">
                        {filteredCourses.map((course) => (
                          <tr key={course._id} className="hover:bg-white hover:bg-opacity-5">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-white">{course.title}</div>
                                <div className="text-sm text-gray-400">{course.category}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">{course.instructor}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{course.students}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                course.status === "active" 
                                  ? "bg-green-500 bg-opacity-20 text-green-300"
                                  : "bg-yellow-500 bg-opacity-20 text-yellow-300"
                              }`}>
                                {course.status}
                              </span>
                            </td>
                           <td className="px-6 py-4">
  <button
    onClick={() => handleCourseAction("delete", course._id)}
    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
    disabled={isLoading}
  >
    <Trash2 size={16} />
  </button>
</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Instructors Tab */}
            {activeTab === "instructors" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Instructor Management</h2>
                 
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.filter(user => user.role === "instructor").map((instructor) => (
                    <div key={instructor._id} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-xl p-6 border border-white border-opacity-20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{instructor.username}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          instructor.status === "active" 
                            ? "bg-green-500 bg-opacity-20 text-green-300"
                            : "bg-red-500 bg-opacity-20 text-red-300"
                        }`}>
                          {instructor.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{instructor.email}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        {/* NOTE: This filtering assumes instructor name is used for courses.instructor */}
                        <span>Courses: {courses.filter(c => c.instructor === instructor.username).length}</span>
                        <span>Students: {courses.filter(c => c.instructor === instructor.username).reduce((sum, c) => sum + (c.students || 0), 0)}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <button className="flex-1 px-3 py-2 bg-purple-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg text-purple-300 transition-colors">
                          View Profile
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">System Settings</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-xl p-6 border border-white border-opacity-20">
                    <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                        <input 
                          type="text" 
                          value="SJU Courses"
                          className="w-full px-3 py-2 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Admin Email</label>
                        <input 
                          type="email" 
                          value="admin@sju.edu"
                          className="w-full px-3 py-2 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Max Students per Course</label>
                        <input 
                          type="number" 
                          value="100"
                          className="w-full px-3 py-2 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  {/* NOTE: There was a partial div copy paste here. I'll include the relevant parts to keep the structure. */}
                   <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-xl p-6 border border-white border-opacity-20">
                     <h3 className="text-lg font-semibold text-white mb-4">API/Integration Settings</h3>
                     <p className="text-gray-400">Placeholder for future API keys and integration controls.</p>
                   </div>
                  {/* End of Settings Fix */}
                </div>
              </div>
            )}
            
            {/* MODAL */}
            {showModal && (
              <Modal title={modalType === "add-user" ? "Add User" : "Add Course"} onClose={closeModal}>
                {modalType === "add-user" && (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const payload = {
                        username: formData.get("username"),
                        email: formData.get("email"),
                        role: formData.get("role"),
                        password: formData.get("password"),
                      };
                      try {
                        // FIX: Use apiService for consistency and correct endpoint
                        const res = await apiService.post("/admin/users", payload); 
                        setUsers([...users, res.data]);
                        showMessage("User added successfully", "success");
                        closeModal();
                      } catch (error) {
                        showMessage(error.response?.data?.error || "Failed to add user", "error");
                      }
                    }}
                    className="space-y-4"
                  >
                    <input name="username" placeholder="Username" className="w-full p-2 rounded bg-gray-800 text-white" required />
                    <input name="email" type="email" placeholder="Email" className="w-full p-2 rounded bg-gray-800 text-white" required />
                    <select name="role" className="w-full p-2 rounded bg-gray-800 text-white">
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <input name="password" type="password" placeholder="Password" className="w-full p-2 rounded bg-gray-800 text-white" required />
                    
                  </form>
                )}

                {modalType === "add-course" && (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const payload = {
                        title: formData.get("title"),
                        category: formData.get("category"),
                        instructor: formData.get("instructor"),
                        duration: formData.get("duration"), // <<< ADDED REQUIRED FIELD
                        level: formData.get("level"),     // <<< ADDED REQUIRED FIELD
                      };
                      try {
                        // FIX: Use apiService and correctly handle server response
                        const res = await apiService.post("/admin/courses", payload); 
                        // Server response contains { course: newCourse }, so we use res.data.course
                        setCourses([...courses, res.data.course]); 
                        showMessage("Course added successfully", "success");
                        closeModal();
                      } catch (error) {
                        showMessage(error.response?.data?.error || "Failed to add course", "error");
                      }
                    }}
                    className="space-y-4"
                  >
                    <input name="title" placeholder="Course Title" className="w-full p-2 rounded bg-gray-800 text-white" required />
                    <input name="category" placeholder="Category" className="w-full p-2 rounded bg-gray-800 text-white" required />
                    <input name="instructor" placeholder="Instructor Name" className="w-full p-2 rounded bg-gray-800 text-white" required />
                    <input name="duration" placeholder="Duration (e.g., 10 hours)" className="w-full p-2 rounded bg-gray-800 text-white" required /> {/* <<< ADDED */}
                    <input name="level" placeholder="Level (e.g., Beginner)" className="w-full p-2 rounded bg-gray-800 text-white" required />       {/* <<< ADDED */}
                    <button type="submit" className="w-full bg-purple-600 py-2 rounded text-white">Add Course</button>
                  </form>
                )}
              </Modal>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
