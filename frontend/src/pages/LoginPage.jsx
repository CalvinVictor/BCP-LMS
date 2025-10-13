import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import Message from "../components/Message";
import RoleToggle from "../components/RoleToggle";
import SocialLogin from "../components/SocialLogin";
import AuthForm from "../components/AuthForm";
import apiService from "../services/apiService";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student"); // Default role
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  // Vanta Background Effect
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

  // --- Helper Functions ---
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const togglePasswordVisibility = (field) => setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000); // Increased timeout for better readability
  };

  // Shared function to handle successful login/registration
  const handleSuccessfulLogin = (data) => {
    showMessage(`Welcome, ${data.user.username}!`, "success");

    // Store user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("userId", data.user.id);

    // Redirect based on the actual role from the backend
    setTimeout(() => {
      if (data.user.role === "instructor") navigate("/instructorhome");
      else if (data.user.role === "admin") navigate("/adminhome");
      else navigate("/home");
    }, 1000);
  };

  // --- Form Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showMessage("", ""); // Clear previous messages

    if (!isLogin && formData.password !== formData.confirmPassword) {
      showMessage("Passwords do not match!", "error");
      setIsLoading(false);
      return;
    }

    try {
      let data;
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const payload = { email: formData.email, password: formData.password };
        data = await apiService.login(payload);
        
        // ✅ THIS IS THE CRITICAL FIX ✅
        // After getting the user data, check if the role from the database
        // matches the role selected on the screen.
        if (data.user.role !== role) {
          showMessage(`You are registered as a ${data.user.role}. Please switch your role to log in.`, "error");
          setIsLoading(false);
          return; // Stop the function here
        }

      } else {
        // --- REGISTRATION LOGIC ---
        const payload = {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
        };
        data = await apiService.register(payload);
      }

      handleSuccessfulLogin(data);

    } catch (error) {
      showMessage(error || "An unexpected error occurred.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const data = await apiService.googleLogin({
        credential: credentialResponse.credential,
        role: role, // Pass the selected role
      });
      handleSuccessfulLogin(data);
    } catch (error) {
      showMessage(error || "Google Sign-In failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    showMessage("Google login failed. Please try again.", "error");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      <div ref={vantaRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white border-opacity-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                SJU Courses
              </h1>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
            </div>

            <RoleToggle role={role} setRole={setRole} />
            <SocialLogin onGoogleSuccess={handleGoogleSuccess} onGoogleError={handleGoogleError} />

            <div className="relative text-center text-gray-400 text-sm mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white border-opacity-10"></div></div>
              <span className="relative bg-gray-900 bg-opacity-50 px-4">or continue with email</span>
            </div>

            <Message message={message} />

            <form onSubmit={handleSubmit}>
              <AuthForm
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                formData={formData}
                showPassword={showPassword}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                togglePasswordVisibility={togglePasswordVisibility}
              />
              {isLogin && (
                <div className="text-right mt-4">
                  <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
