import React from "react";
import PasswordField from "./PasswordField";

const AuthForm = ({
  isLogin,
  setIsLogin,
  role,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  isLoading,
  handleInputChange,
  handleSubmit,
  togglePasswordVisibility,
  showMessage,
}) => {
  return (
    <>
      <div className="space-y-4">
        {!isLogin && (
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full name"
              required
              className="w-full py-4 px-4 pr-12 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl text-white placeholder-gray-400"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              👤
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            required
            className="w-full py-4 px-4 pr-12 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl text-white placeholder-gray-400"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            📧
          </div>
        </div>

        <PasswordField
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          isVisible={showPassword.password}
          toggleVisibility={() => togglePasswordVisibility("password")}
        />

        {!isLogin && (
          <PasswordField
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            isVisible={showPassword.confirmPassword}
            toggleVisibility={() => togglePasswordVisibility("confirmPassword")}
          />
        )}

        {isLogin && (
          <div className="text-center">
           
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          onClick={handleSubmit}
          className="w-full py-4 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : isLogin ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>
      </div>

      <div className="text-center mt-6 text-gray-400 text-sm">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            showMessage("", "");
          }}
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </>
  );
};

export default AuthForm;
