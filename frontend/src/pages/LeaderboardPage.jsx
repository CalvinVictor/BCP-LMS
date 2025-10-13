import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import Layout from '../Components/Layout';
import { Award, Trophy, RefreshCw } from 'lucide-react';
import CertificateButton from '../Components/CertificateButton';

const LeaderboardPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [courseTitle, setCourseTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetches both leaderboard and current user data at the same time
    const fetchLeaderboardData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [leaderboardData, currentUserData] = await Promise.all([
                apiService.getLeaderboard(courseId),
                // ✅ FIX: Changed to use the correct function name from your apiService file
                apiService.getUserProfile() 
            ]);
            
            setLeaderboard(leaderboardData || []);
            setCurrentUser(currentUserData);
            setCourseTitle("Course Leaderboard");

        } catch (err) {
            console.error("⚠️ Failed to load leaderboard data:", err);
            setError("Failed to load leaderboard. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboardData();
    }, [courseId]);

    const handleRefresh = () => {
        fetchLeaderboardData();
    };

    const validLeaderboard = leaderboard.filter(entry => entry.student);

    return (
        <Layout>
            <div className="relative min-h-screen flex flex-col items-center p-6 md:p-12 text-white overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-900 via-purple-700 to-purple-900 animate-gradient-xy"></div>
                
                <Trophy className="w-28 h-28 text-yellow-400 mb-6 drop-shadow-lg" />
                <h1 className="text-5xl md:text-6xl font-extrabold mb-2 tracking-wide drop-shadow-lg">Leaderboard</h1>
                <h2 className="text-2xl md:text-3xl text-purple-300 mb-10 tracking-wide">{courseTitle}</h2>

                <div className="w-full max-w-3xl bg-purple-900 bg-opacity-70 rounded-3xl p-8 shadow-2xl backdrop-blur-md border border-purple-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-3xl font-semibold text-purple-300 tracking-wide">All Participants</h3>
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition-transform active:scale-95"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-purple-500 mx-auto mb-6 shadow-lg"></div>
                            <p className="text-purple-300 text-lg font-medium">Loading leaderboard...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-400">
                            <p className="text-xl font-semibold">{error}</p>
                        </div>
                    ) : validLeaderboard.length === 0 ? (
                        <div className="text-center py-12 text-purple-400">
                            <Award className="w-20 h-20 mx-auto mb-6 opacity-60 drop-shadow-lg" />
                            <p className="text-2xl mb-3 font-semibold">No scores yet!</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900">
                            {/* Top 3 Podium Section */}
                            {validLeaderboard.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-xl font-bold mb-5 text-yellow-400 tracking-wide flex items-center space-x-3">
                                        <span>🏆</span>
                                        <span>Top 3 Champions</span>
                                    </h4>
                                    {validLeaderboard.slice(0, 3).map((entry, index) => {
                                        const rankStyles = [
                                            { medal: '🥇', bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500', text: 'text-gray-900', shadow: 'shadow-yellow-400/60' },
                                            { medal: '🥈', bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-900', shadow: 'shadow-gray-400/60' },
                                            { medal: '🥉', bg: 'bg-gradient-to-r from-yellow-600 to-yellow-700', text: 'text-white', shadow: 'shadow-yellow-600/60' },
                                        ];
                                        const style = rankStyles[index];

                                        const isCurrentUser = currentUser && entry.student && currentUser._id === entry.student._id;

                                        return (
                                            <div
                                                key={`top-${entry._id || index}`}
                                                className={`flex justify-between items-center p-5 mb-4 rounded-2xl shadow-2xl ${style.bg} ${style.text} ${style.shadow} ${isCurrentUser ? 'ring-4 ring-purple-400' : ''}`}
                                            >
                                                <div className="flex items-center space-x-6">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-extrabold text-4xl">{index + 1}</span>
                                                        <span className="text-4xl">{style.medal}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-2xl tracking-wide">
                                                            {entry.student.name || entry.student.username}
                                                        </div>
                                                        {isCurrentUser && (
                                                            <div className="text-sm font-semibold bg-purple-600 text-white px-3 py-1 rounded-full inline-block mt-1">
                                                                You
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right select-none">
                                                    <div className="font-extrabold text-3xl tracking-wide">{entry.score || 0} pts</div>
                                                    {entry.timeTaken && (
                                                        <div className="text-sm opacity-80 mt-1">{entry.timeTaken}s</div>
                                                    )}
                                                    {isCurrentUser && (
                                                        <CertificateButton
                                                            userId={entry.student._id}
                                                            userName={entry.student.name || entry.student.username}
                                                            courseId={courseId}
                                                            courseName={courseTitle}
                                                            rank={index + 1}
                                                            score={entry.score}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* All Other Participants */}
                            {validLeaderboard.length > 3 && (
                                <div>
                                    <h4 className="text-xl font-semibold mb-5 text-purple-300 tracking-wide flex items-center space-x-3">
                                        <span>📊</span>
                                        <span>Other Participants</span>
                                    </h4>
                                    {validLeaderboard.slice(3).map((entry, index) => {
                                        const actualIndex = index + 3;
                                        const isCurrentUser = currentUser && entry.student && currentUser._id === entry.student._id;

                                        return (
                                            <div
                                                key={`other-${entry._id || actualIndex}`}
                                                className={`flex justify-between items-center p-4 mb-3 rounded-xl bg-purple-800 bg-opacity-80 ${isCurrentUser ? 'ring-2 ring-purple-400' : ''}`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <span className="font-bold text-lg w-8">{actualIndex + 1}.</span>
                                                    <div>
                                                        <div className="font-semibold tracking-wide">
                                                            {entry.student.name || entry.student.username}
                                                            {isCurrentUser && (
                                                                <span className="ml-3 text-xs bg-purple-600 text-white px-3 py-1 rounded-full">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold tracking-wide">{entry.score || 0} pts</div>
                                                    {entry.timeTaken && (
                                                        <div className="text-xs text-purple-300">{entry.timeTaken}s</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="flex space-x-6 mt-12">
                    <button onClick={() => navigate(`/quiz/${courseId}`)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95">
                        Take Quiz Again
                    </button>
                    <button onClick={() => navigate('/home')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95">
                        Back to Home
                    </button>
                </div>
                
                <style>{`
                    @keyframes gradient-xy {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    .animate-gradient-xy {
                        background-size: 200% 200%;
                        animation: gradient-xy 15s ease infinite;
                    }
                `}</style>
            </div>
        </Layout>
    );
};

export default LeaderboardPage;