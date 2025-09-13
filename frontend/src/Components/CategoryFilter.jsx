import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-10 animate-fade-in-up animation-delay-300">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105
            ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700"
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;