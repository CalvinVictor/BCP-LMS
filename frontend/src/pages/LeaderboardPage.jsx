
// ===== UPDATED QUIZ PAGE (handleNextQuestion function) =====
const handleNextQuestion = () => {
  setAnimationData(null);
  const nextQuestionIndex = currentQuestionIndex + 1;
  if (nextQuestionIndex < quiz.questions.length) {
    setCurrentQuestionIndex(nextQuestionIndex);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimer(15);
  } else {
    setQuizState('finished');
    
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const userId = localStorage.getItem("userId");
    
    console.log("🚀 Submitting quiz result:", {
      courseId,
      userId,
      score,
      timeTaken,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString()
    });
    
    // Enhanced error handling for score submission
    apiService.submitTestResult(courseId, score, timeTaken)
      .then((response) => {
        console.log("✅ Score saved successfully:", response);
        return apiService.getLeaderboard(courseId);
      })
      .then((leaderboardData) => {
        console.log("📊 Leaderboard data:", leaderboardData);
        setLeaderboard(leaderboardData);
      })
      .catch(err => {
        console.error("❌ Failed to save score or fetch leaderboard:", err);
        // Still try to fetch leaderboard even if save failed
        apiService.getLeaderboard(courseId)
          .then(setLeaderboard)
          .catch(leaderErr => console.error("❌ Failed to fetch leaderboard:", leaderErr));
      });
  }
};

// ===== UPDATED LEADERBOARD PAGE =====
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import Layout from '../Components/Layout';
import { Award, Trophy, RefreshCw } from 'lucide-react';

const LeaderboardPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [courseTitle, setCourseTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchLeaderboard = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log("🔍 Fetching leaderboard for course:", courseId);
            
            const data = await apiService.getLeaderboard(courseId);
            console.log("📊 Received leaderboard data:", data);
            
            setLeaderboard(data || []);
            setCourseTitle("Course Leaderboard");
        } catch (error) {
            console.error("❌ Failed to fetch leaderboard:", error);
            setError("Failed to load leaderboard. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchLeaderboard();
    }, [courseId]);

    const handleRefresh = () => {
        fetchLeaderboard();
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 md:p-8">
                <Trophy className="w-24 h-24 text-yellow-400 mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Leaderboard</h1>
                <h2 className="text-xl md:text-2xl text-gray-400 mb-8">{courseTitle}</h2>
                
                <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold">Top Performers</h3>
                        <button 
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                    
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                            <p>Loading leaderboard...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-400">
                            <p>{error}</p>
                            <button 
                                onClick={handleRefresh}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-xl mb-2">No scores yet!</p>
                            <p>Be the first to complete the quiz and claim the top spot!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leaderboard.map((entry, index) => {
                                const rankStyles = [
                                    { medal: '🥇', bg: 'bg-yellow-400', text: 'text-gray-900' },
                                    { medal: '🥈', bg: 'bg-gray-400', text: 'text-gray-900' },
                                    { medal: '🥉', bg: 'bg-yellow-600', text: 'text-gray-900' },
                                ];
                                const style = rankStyles[index] || { medal: '', bg: 'bg-gray-700', text: 'text-white' };
                                
                                return (
                                    <div key={entry._id || index} className={`flex justify-between items-center p-4 rounded-lg shadow-lg ${style.bg} ${style.text} transition-all hover:scale-105`}>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold text-2xl">{index + 1}.</span>
                                            <span className="text-2xl">{style.medal}</span>
                                            <div>
                                                <span className="font-bold text-xl">
                                                    {entry.student?.username || entry.student?.name || 'Unknown User'}
                                                </span>
                                                {entry.completedAt && (
                                                    <div className="text-sm opacity-75">
                                                        {new Date(entry.completedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl">{entry.score || 0} pts</div>
                                            {entry.timeTaken && (
                                                <div className="text-sm opacity-75">
                                                    {entry.timeTaken}s
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                <div className="flex space-x-4 mt-8">
                    <button 
                        onClick={() => navigate(`/quiz/${courseId}`)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
                    >
                        Take Quiz Again
                    </button>
                    <button 
                        onClick={() => navigate('/home')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default LeaderboardPage;