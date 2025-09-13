import React, { useState, useEffect } from 'react';
import { BookOpen, Award } from 'lucide-react';
import apiService from '../services/apiService';

const WelcomeSection = () => {
  const [stats, setStats] = useState({ coursesInProgress: 0, certificatesEarned: 0 });
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username') || 'Student';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getHomeStats();
        setStats(data);
      } catch (error) {
        console.error("Could not fetch home stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // SJU Logo SVG for a clean, scalable logo
  const SjuLogo = () => (
    <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 11.5L4.5 10.25l7.5 3.75 7.5-3.75L12 13.5zm0 3L4.5 12.75l7.5 3.75 7.5-3.75L12 16.5z"/>
        <path d="M2 17l10 5 10-5-10-5-10 5z"/>
    </svg>
  );

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 mb-8 text-white overflow-hidden animate-fade-in-down border border-purple-800 shadow-lg shadow-purple-500/20">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-2xl animate-blob"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full opacity-10 blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-indigo-500 rounded-full opacity-10 blur-2xl animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-purple-400">{username}!</span> 👋
          </h1>
          <p className="text-purple-200 mb-6">
            Ready to continue your learning journey? You're making great progress!
          </p>
          <div className="flex flex-wrap gap-6 text-lg">
            <div className="flex items-center animate-fade-in-right animation-delay-300">
              <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
              <span className="font-semibold">{stats.coursesInProgress}</span>
              <span className="ml-2 text-blue-200">courses in progress</span>
            </div>
            <div className="flex items-center animate-fade-in-right animation-delay-500">
              <Award className="w-6 h-6 mr-3 text-yellow-400" />
              <span className="font-semibold">{stats.certificatesEarned}</span>
              <span className="ml-2 text-yellow-200">certificates earned</span>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-0 animate-logo-float">
          <SjuLogo />
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;