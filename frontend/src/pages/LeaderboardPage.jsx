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

    const fetchCurrentUser = async () => {
        try {
            const data = await apiService.getCurrentUser();
            setCurrentUser(data);
        } catch (err) {
            console.error("⚠️ Failed to fetch current user:", err);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await apiService.getLeaderboard(courseId);
            setLeaderboard(data || []);
            setCourseTitle("Course Leaderboard"); // You might want to get this from the API too
        } catch (error) {
            setError("Failed to load leaderboard. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        fetchCurrentUser();
    }, [courseId]);

    const handleRefresh = () => {
        fetchLeaderboard();
    };

    // ✅ Create a new list containing only entries with valid student data
    const validLeaderboard = leaderboard.filter(entry => entry.student);

    return (
        <Layout>
            <div className="relative min-h-screen flex flex-col items-center p-6 md:p-12 text-white overflow-hidden">
                {/* 3D Animated Purple Gradient Background */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-900 via-purple-700 to-purple-900 animate-gradient-xy"></div>
                <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800 via-purple-900 to-purple-950 opacity-80"></div>
                <div className="absolute inset-0 -z-30 bg-[url('/3d-grid.svg')] bg-center bg-no-repeat bg-contain opacity-20 animate-pulse"></div>

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
                            <button
                                onClick={handleRefresh}
                                className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-transform active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                     // ✅ Use validLeaderboard here
                    ) : validLeaderboard.length === 0 ? (
                        <div className="text-center py-12 text-purple-400">
                            <Award className="w-20 h-20 mx-auto mb-6 opacity-60 drop-shadow-lg" />
                            <p className="text-2xl mb-3 font-semibold">No scores yet!</p>
                            <p className="text-lg">Be the first to complete the quiz and claim the top spot!</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900">
                            {/* Top 3 Podium Section */}
                             {/* ✅ Use validLeaderboard here */}
                            {validLeaderboard.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-xl font-bold mb-5 text-yellow-400 tracking-wide flex items-center space-x-3">
                                        <span>🏆</span>
                                        <span>Top 3 Champions</span>
                                    </h4>
                                     {/* ✅ Use validLeaderboard here */}
                                    {validLeaderboard.slice(0, 3).map((entry, index) => {
                                        const rankStyles = [
                                            { medal: '🥇', bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500', text: 'text-gray-900', shadow: 'shadow-yellow-400/60' },
                                            { medal: '🥈', bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-900', shadow: 'shadow-gray-400/60' },
                                            { medal: '🥉', bg: 'bg-gradient-to-r from-yellow-600 to-yellow-700', text: 'text-white', shadow: 'shadow-yellow-600/60' },
                                        ];
                                        const style = rankStyles[index];

                                        const isCurrentUser =
                                            currentUser && (currentUser._id === entry.student?._id || currentUser._id === entry.userId);

                                        return (
                                            <div
                                                key={`top-${entry._id || index}`}
                                                className={`flex justify-between items-center p-5 mb-4 rounded-2xl shadow-2xl ${style.bg} ${style.text} ${style.shadow} transition-transform transform hover:scale-[1.04] hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] perspective-1000 ${
                                                    isCurrentUser ? 'ring-4 ring-purple-400 ring-opacity-80' : ''
                                                }`}
                                                style={{ transformStyle: 'preserve-3d' }}
                                            >
                                                <div className="flex items-center space-x-6">
                                                    <div className="flex flex-col items-center select-none">
                                                        <span className="font-extrabold text-4xl">{index + 1}</span>
                                                        <span className="text-4xl">{style.medal}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-2xl tracking-wide">
                                                          {/* This fallback is now just a safety measure */}
                                                            {entry.student?.username || entry.student?.name || 'Unknown User'}
                                                        </div>
                                                        {isCurrentUser && (
                                                            <div className="text-sm font-semibold bg-purple-600 text-white px-3 py-1 rounded-full inline-block mt-1 select-none shadow-md">
                                                                You
                                                            </div>
                                                        )}
                                                        {entry.completedAt && (
                                                            <div className="text-sm opacity-80 mt-1 select-none">
                                                                {new Date(entry.completedAt).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right select-none">
                                                    <div className="font-extrabold text-3xl tracking-wide">{entry.score || 0} pts</div>
                                                    {entry.timeTaken && (
                                                        <div className="text-sm opacity-80 mt-1">{entry.timeTaken}s</div>
                                                    )}
                                                    <CertificateButton
                                                        userId={entry.student?._id || entry.userId}
                                                        userName={entry.student?.username || entry.student?.name}
                                                        courseId={courseId}
                                                        courseName={courseTitle}
                                                        rank={index + 1}
                                                        score={entry.score}
                                                        className={isCurrentUser ? 'current-user' : ''}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* All Other Participants (4th place and below) */}
                            {/* ✅ Use validLeaderboard here */}
                            {validLeaderboard.length > 3 && (
                                <div>
                                    <h4 className="text-xl font-semibold mb-5 text-purple-300 tracking-wide flex items-center space-x-3">
                                        <span>📊</span>
                                        <span>Other Participants</span>
                                    </h4>
                                     {/* ✅ Use validLeaderboard here */}
                                    {validLeaderboard.slice(3).map((entry, index) => {
                                        const actualIndex = index + 3;
                                        const isCurrentUser =
                                            currentUser && (currentUser._id === entry.student?._id || currentUser._id === entry.userId);

                                        return (
                                            <div
                                                key={`other-${entry._id || actualIndex}`}
                                                className={`flex justify-between items-center p-4 mb-3 rounded-xl bg-purple-800 bg-opacity-80 text-white shadow-md transition-colors hover:bg-purple-700 ${
                                                    isCurrentUser ? 'ring-2 ring-purple-400' : ''
                                                }`}
                                            >
                                                <div className="flex items-center space-x-4 select-none">
                                                    <span className="font-bold text-lg w-8">{actualIndex + 1}.</span>
                                                    <div>
                                                        <div className="font-semibold tracking-wide">
                                                            {entry.student?.username || entry.student?.name || 'Unknown User'}
                                                            {isCurrentUser && (
                                                                <span className="ml-3 text-xs bg-purple-600 text-white px-3 py-1 rounded-full select-none shadow-sm">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        {entry.completedAt && (
                                                            <div className="text-xs text-purple-300 mt-1 select-none">
                                                                {new Date(entry.completedAt).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right select-none">
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
                    <button
                        onClick={() => navigate(`/quiz/${courseId}`)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95"
                    >
                        Take Quiz Again
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-transform active:scale-95"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Custom styles for animated gradient */}
                <style>{`
                    @keyframes gradient-xy {
                        0%, 100% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                    }
                    .animate-gradient-xy {
                        background-size: 200% 200%;
                        animation: gradient-xy 15s ease infinite;
                    }
                    /* Scrollbar styles */
                    .scrollbar-thin::-webkit-scrollbar {
                        width: 6px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb {
                        background-color: #7c3aed; /* purple-600 */
                        border-radius: 3px;
                    }
                `}</style>
            </div>
        </Layout>
    );
};

export default LeaderboardPage;