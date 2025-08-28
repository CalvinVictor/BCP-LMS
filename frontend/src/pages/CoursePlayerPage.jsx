import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player'; 
import apiService from '../services/apiService';
import Layout from '../Components/Layout';
import { Film, CheckCircle, Award, X, HelpCircle } from 'lucide-react';

// --- (QuizModal and CertificateModal components remain the same) ---
const QuizModal = ({ chapter, onClose, onQuizComplete }) => {
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const handleAnswerChange = (questionIndex, option) => setAnswers({ ...answers, [questionIndex]: option });
    const handleSubmit = () => {
        let correctAnswers = 0;
        chapter.mcqs.forEach((mcq, index) => {
            if (answers[index] === mcq.correctAnswer) correctAnswers++;
        });
        const finalScore = (correctAnswers / chapter.mcqs.length) * 100;
        setScore(finalScore);
        onQuizComplete(finalScore >= 70);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Quiz: {chapter.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24}/></button>
                </div>
                {score === null ? (
                    <div>
                        {chapter.mcqs.map((mcq, qIndex) => (
                            <div key={qIndex} className="mb-6">
                                <p className="text-lg text-white mb-3">{qIndex + 1}. {mcq.question}</p>
                                <div className="space-y-2">
                                    {mcq.options.map((option, oIndex) => (
                                        <label key={oIndex} className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600">
                                            <input type="radio" name={`question-${qIndex}`} value={option} onChange={() => handleAnswerChange(qIndex, option)} className="mr-3 form-radio text-blue-500 bg-gray-900"/>
                                            <span className="text-gray-300">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Submit Answers</button>
                    </div>
                ) : (
                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-4">Your Score: <span className={score >= 70 ? 'text-green-400' : 'text-red-400'}>{score.toFixed(0)}%</span></h3>
                        <p className="text-lg text-gray-300 mb-6">{score >= 70 ? "Congratulations, you passed!" : "You did not pass. Please review the material and try again."}</p>
                        <button onClick={onClose} className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-500">Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};
const CertificateModal = ({ courseTitle, studentName, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white text-gray-800 p-10 rounded-lg w-full max-w-3xl text-center relative border-4 border-yellow-400">
             <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black"><X size={24}/></button>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Certificate of Completion</h1>
            <p className="text-lg mb-6">This certifies that</p>
            <p className="text-3xl font-semibold mb-6">{studentName || "Valued Student"}</p>
            <p className="text-lg mb-6">has successfully completed the course</p>
            <p className="text-2xl font-bold text-purple-600 mb-8">"{courseTitle}"</p>
            <div className="flex justify-between items-center">
                <p className="text-sm">Issued: {new Date().toLocaleDateString()}</p>
                <p className="text-lg font-bold">LMS Learning</p>
            </div>
        </div>
    </div>
);


// --- Main Course Player Page Component ---
const CoursePlayerPage = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const studentName = localStorage.getItem('username');

    useEffect(() => {
        const fetchLearningData = async () => {
            try {
                const data = await apiService.getCourseForLearning(courseId);
                setCourse(data.course);
                setEnrollment(data.enrollment);
            } catch (err) {
                setError("Access denied. You may not be enrolled in this course.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLearningData();
    }, [courseId]);

    const handleQuizComplete = async (passed) => {
        setShowQuizModal(false); // Close the quiz modal immediately
        if (passed) {
            // Mark the chapter as complete
            const currentChapter = course.chapters[currentChapterIndex];
            try {
                const { enrollment: updatedEnrollment } = await apiService.markChapterAsComplete(courseId, currentChapter._id);
                setEnrollment(updatedEnrollment);

                // Check if this was the final chapter
                if (currentChapterIndex === course.chapters.length - 1) {
                    await apiService.markCourseAsComplete(courseId);
                    setEnrollment(prev => ({ ...prev, progress: 100 })); // Update UI immediately
                    setShowCertificate(true); // Generate certificate
                }
            } catch (err) {
                console.error("Failed to update progress:", err);
            }
        }
    };

    if (isLoading) return <Layout><div className="text-center text-white py-20">Loading Your Course...</div></Layout>;
    if (error) return <Layout><div className="text-center text-red-400 py-20">{error}</div></Layout>;
    if (!course || !course.chapters || course.chapters.length === 0) {
        return <Layout><div className="text-center text-white py-20">Course content is not available yet.</div></Layout>;
    }

    const currentChapter = course.chapters[currentChapterIndex];

    return (
        <Layout>
            {showQuizModal && <QuizModal chapter={currentChapter} onClose={() => setShowQuizModal(false)} onQuizComplete={handleQuizComplete} />}
            {showCertificate && <CertificateModal courseTitle={course.title} studentName={studentName} onClose={() => setShowCertificate(false)} />}

            <div className="container mx-auto p-4 md:p-8 text-white">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <div className="aspect-video bg-black rounded-xl mb-6 overflow-hidden">
                            <ReactPlayer
                                url={currentChapter.videoURL}
                                width="100%"
                                height="100%"
                                controls
                            />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{currentChapter.title}</h1>
                        <p className="text-gray-400 mb-6">{currentChapter.description}</p>
                        
                        {/* ✅ QUIZ BUTTON IS NOW ALWAYS ENABLED */}
                        <button 
                            onClick={() => navigate(`/test/${courseId}`)}
                            className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-purple-700"
                        >
                            <HelpCircle/>
                            Take Quiz
                        </button>
                    </div>

                    <div className="lg:col-span-1 bg-gray-800 rounded-xl p-6 border border-gray-700 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${enrollment?.progress || 0}%`}}></div>
                        </div>
                        <p className="text-center text-gray-400 mb-4">{enrollment?.progress || 0}% Complete</p>
                        <ul className="space-y-2">
                            {course.chapters.map((chapter, index) => (
                                <li 
                                    key={chapter._id}
                                    onClick={() => setCurrentChapterIndex(index)}
                                    className={`p-4 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                                        index === currentChapterIndex ? 'bg-blue-500/30 text-blue-300' : 'hover:bg-gray-700'
                                    }`}
                                >
                                    {enrollment?.completedChapters?.includes(chapter._id) ? <CheckCircle size={20} className="text-green-400 flex-shrink-0"/> : <Film size={20} className="flex-shrink-0"/>}
                                    <span className="flex-grow">{chapter.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CoursePlayerPage;