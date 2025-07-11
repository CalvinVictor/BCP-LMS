import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, searchTerm, setSearchTerm, showSearch = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        showSearch={showSearch}
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;