import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import Message from "../Components/Message";
import PasswordField from "../Components/PasswordField";

const ResetPasswordPage = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return showMessage("Passwords do not match!", "error");
    }
    if (formData.password.length < 8) {
        return showMessage("Password must be at least 8 characters long!", "error");
    }

    setIsLoading(true);
    try {
      const data = await apiService.resetPassword(resetToken, formData.password);
      showMessage(data.message, "success");
      setTimeout(() => navigate('/'), 2000); // Redirect to login on success
    } catch (error) {
      showMessage(error.toString(), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Reset Your Password</h2>
            <p className="text-gray-400">Enter your new password below.</p>
          </div>

          <Message message={message} />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordField
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="New Password"
              isVisible={showPassword.password}
              toggleVisibility={() => togglePasswordVisibility("password")}
            />
            <PasswordField
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm New Password"
              isVisible={showPassword.confirmPassword}
              toggleVisibility={() => togglePasswordVisibility("confirmPassword")}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;