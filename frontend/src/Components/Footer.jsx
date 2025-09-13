import React from 'react';
import { BookOpen } from 'lucide-react';

const SjuLogo = () => (
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 11.5L4.5 10.25l7.5 3.75 7.5-3.75L12 13.5zm0 3L4.5 12.75l7.5 3.75 7.5-3.75L12 16.5z"/>
        <path d="M2 17l10 5 10-5-10-5-10 5z"/>
    </svg>
);


const Footer = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-700/50 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <SjuLogo />
              <span className="text-xl font-bold text-white">St. Joseph's University</span>
            </div>
            <p className="text-slate-400 text-sm">
              Empowering the next generation of learners with cutting-edge technology and industry-relevant training.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-slate-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-base text-slate-400 hover:text-white">Courses</a></li>
              <li><a href="#" className="text-base text-slate-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-slate-400 hover:text-white">Web Development</a></li>
              <li><a href="#" className="text-base text-slate-400 hover:text-white">Data Science</a></li>
              <li><a href="#" className="text-base text-slate-400 hover:text-white">Machine Learning</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-base text-slate-400">
                <li>contact@stjosephs.edu</li>
                <li>Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700/50 pt-8 text-center">
          <p className="text-base text-slate-400">&copy; {new Date().getFullYear()} St. Joseph's University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;