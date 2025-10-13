import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  // ✅ FIX: This function gets the correct home path based on the user's role
  const getHomePath = () => {
    const role = localStorage.getItem('role');
    if (role === 'instructor') {
      return '/instructorhome';
    }
    if (role === 'admin') {
      return '/adminhome';
    }
    return '/home'; // Default for students
  };

  return (
    <footer className="bg-slate-900/50 border-t border-slate-700/50 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Course Hub</span>
            </div>
            <p className="text-slate-400 text-sm">
              Empowering the next generation of learners with cutting-edge technology and industry-relevant training.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-base text-slate-400">
                <li>
                  <a href="mailto:contact@coursehub.com" className="hover:text-white">
                    contact@coursehub.com
                  </a>
                </li>
                <li>Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700/50 pt-8 text-center">
          <p className="text-base text-slate-400">&copy; {new Date().getFullYear()} Course Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;