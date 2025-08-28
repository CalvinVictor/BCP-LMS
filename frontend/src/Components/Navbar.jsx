import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, LogOut, Bell, Search } from "lucide-react";

const Navbar = ({ searchTerm, setSearchTerm, showSearch = true }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LMS Learning
              </h2>
            </div>
            
            {/* Search Bar - conditionally rendered */}
            {showSearch && (
              <div className="relative ml-8">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            
            <button 
              
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200">
              <BookOpen className="w-4 h-4" />
              <span>My Courses</span>
            </button>
            
           <button
  onClick={() => {
    localStorage.removeItem("token"); // Clear token
    sessionStorage.clear();          // Optional: clear session data
    navigate("/Login");          // Redirect to login
  }}
  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700"
>
  <LogOut className="w-4 h-4" />
  <span>Logout</span>
</button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;