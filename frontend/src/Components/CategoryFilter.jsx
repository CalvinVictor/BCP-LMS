import React from "react";

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <section className="mb-8">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;