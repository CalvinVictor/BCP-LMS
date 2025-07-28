import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // ✅ Keep this import here
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

import RoleToggle from "../Components/RoleToggle";
import SocialLogin from "../components/SocialLogin";
import Message from "../components/Message";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const vantaRef = useRef(null);

  // Vanta Background
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

  // Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle Password
  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  // Show Alert
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // Login/Register Submit
// Inside your component:
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (!isLogin && formData.password !== formData.confirmPassword) {
    showMessage("Passwords do not match!", "error");
    setIsLoading(false);
    return;
  }

  if (!isLogin && formData.password.length < 8) {
    showMessage("Password must be at least 8 characters long!", "error");
    setIsLoading(false);
    return;
  }

  try {
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
        };

    const { data } = await axios.post(url, payload);

    // Role check during login
    if (isLogin && data.user.role !== role) {
      showMessage(`You are registered as ${data.user.role}. Please switch role to login.`, "error");
      setIsLoading(false);
      return;
    }

    showMessage(`Welcome ${data.user.username}`, "success");

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("username", data.user.username);

    setTimeout(() => {
          if (data.user.role === "instructor") {
  navigate("/instructorhome");
} else if (data.user.role === "student") {
  navigate("/home");
} else if (data.user.role === "admin") {
  navigate("/adminhome");
} else {
  navigate("/home"); // fallback
}

    }, 1000);

  } catch (error) {
    console.error(error);
    showMessage(error.response?.data?.error || "An error occurred", "error");
  } finally {
    setIsLoading(false);
  }
};




  // Social Login Click
  const handleSocialLogin = (provider) => {
    showMessage(`${provider} login would be integrated here`, "success");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      <div ref={vantaRef} className="absolute inset-0 z-0" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white border-opacity-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                SJU Courses
              </h1>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-400 text-sm">
                {isLogin ? "Sign in to your account" : "Join our learning community"}
              </p>
            </div>

            {/* Role Selector */}
            <RoleToggle role={role} setRole={setRole} />

            {/* Social Login */}
            <SocialLogin handleSocialLogin={handleSocialLogin} />

            {/* Divider */}
            <div className="relative text-center text-gray-400 text-sm mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white border-opacity-10"></div>
              </div>
              <span className="relative bg-gray-900 bg-opacity-50 px-4">
                or continue with email
              </span>
            </div>

            {/* Message */}
            <Message message={message} />

            {/* Auth Form */}
            <form onSubmit={handleSubmit}>
              <AuthForm
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                role={role}
                formData={formData}
                setFormData={setFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                togglePasswordVisibility={togglePasswordVisibility}
                showMessage={showMessage}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
