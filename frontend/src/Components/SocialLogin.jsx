import React from "react";

const SocialLogin = ({ handleSocialLogin }) => {
  return (
    <div className="flex gap-3 mb-6">
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl text-white hover:bg-opacity-10 transition-all duration-300 hover:transform hover:-translate-y-0.5"
      >
        <div className="w-5 h-5 rounded-full bg-red-500"></div>
        Google
      </button>
      <button
        type="button"
        onClick={() => handleSocialLogin("microsoft")}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl text-white hover:bg-opacity-10 transition-all duration-300 hover:transform hover:-translate-y-0.5"
      >
        <div className="w-5 h-5 rounded-full bg-blue-500"></div>
        Microsoft
      </button>
    </div>
  );
};

export default SocialLogin;
