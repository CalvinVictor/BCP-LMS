import React from "react";
import { BookOpen, TrendingUp, Award } from "lucide-react";

const WelcomeSection = ({ userName = "Calvin", coursesInProgress = 3, certificatesEarned = 2 }) => {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-gray-300 text-lg">
              Ready to continue your learning journey? You're making great progress!
            </p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">
                  {coursesInProgress} courses in progress
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  {certificatesEarned} certificates earned
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;