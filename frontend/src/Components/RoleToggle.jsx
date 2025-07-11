import React from "react";

const RoleToggle = ({ role, setRole }) => {
  return (
    <div className="mb-6">
      <div className="flex bg-white bg-opacity-10 rounded-xl p-1 relative">
        <div
          className={`absolute top-1 bottom-1 w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-300 ${
            role === "student"
              ? "left-1"
              : role === "instructor"
              ? "left-1/3"
              : "left-2/3"
          }`}
        />
        {["student", "instructor", "admin"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 relative z-10 ${
              role === r ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleToggle;
