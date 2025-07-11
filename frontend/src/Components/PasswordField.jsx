import React from "react";

const PasswordField = ({
  name,
  value,
  onChange,
  placeholder,
  isVisible,
  toggleVisibility,
}) => {
  return (
    <div className="relative">
      <input
        type={isVisible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full py-4 px-4 pr-12 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl text-white placeholder-gray-400"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
      >
        {isVisible ? "🙈" : "👁️"}
      </button>
    </div>
  );
};

export default PasswordField;
