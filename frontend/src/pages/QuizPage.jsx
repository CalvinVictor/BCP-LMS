import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import { Target, Clock, Award } from 'lucide-react';

import apiService from '../services/apiService'; // Ensure this path is correct
import cheerAnimation from '../assets/animations/cheer.json';
import frownAnimation from '../assets/animations/frown.json';

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // ✅ State for fetched quiz, loading, and errors
  const [quiz, setQuiz] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for the game flow
  const [quizState, setQuizState] = useState('start'); // 'start', 'active', 'finished'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(15);
  const [animationData, setAnimationData] = useState(null);

  // ✅ This useEffect hook now fetches the live quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await apiService.getQuizForCourse(courseId);
        setQuiz(quizData);
      } catch (err) {
        setError("Could not load the quiz. Please try again.");
        console.error("Failed to fetch quiz", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [courseId]);

  // Timer countdown effect
  useEffect(() => {
    if (quizState === 'active' && !isAnswered) {
      if (timer > 0) {
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
      } else {
        handleAnswerClick(null, true); // Time's up
      }
    }
  }, [quizState, isAnswered, timer]);

  // ✅ Logic updated to work with the database question format
  const handleAnswerClick = (answerText, isTimeUp = false) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answerText);
    const correctAnswer = quiz.questions[currentQuestionIndex].correctAnswer;

    if (!isTimeUp && answerText === correctAnswer) {
      const points = 500 + timer * 50;
      setScore(prev => prev + points);
      setAnimationData(cheerAnimation);
    } else {
      setAnimationData(frownAnimation);
    }
    
    setTimeout(() => handleNextQuestion(), 2000);
  };

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
      // Later, you'll add the API call to save the score here
      // apiService.submitTestResult(courseId, score);
    }
  };

  const restartQuiz = () => navigate(0);

  // ✅ Logic updated to work with the database question format
  const getAnswerClass = (option) => {
    if (!isAnswered) return 'bg-gray-800 hover:bg-purple-700';
    
    const correctAnswer = quiz.questions[currentQuestionIndex].correctAnswer;

    if (option === correctAnswer) return 'bg-green-500 text-white animate-jiggle'; 
    if (option === selectedAnswer) return 'bg-red-500 text-white animate-shake';
    
    return 'bg-gray-700 bg-opacity-50';
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p className="text-2xl font-bold">Loading Quiz...</p></div>;
  }
  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p className="text-2xl font-bold text-red-500">{error}</p></div>;
  }
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p className="text-2xl font-bold">No quiz questions found for this course.</p></div>;
  }

  if (quizState === 'start') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold mb-2 text-purple-400">Ready to Test Your Knowledge?</h1>
        <h2 className="text-2xl text-gray-300 mb-8">{quiz.title}</h2>
        <p className="text-lg mb-8 max-w-2xl text-center text-gray-400">You have 15 seconds for each question. Answer quickly for bonus points!</p>
        <button onClick={() => setQuizState('active')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-lg text-2xl">Start Quiz</button>
      </div>
    );
  }

  if (quizState === 'finished') {
    // This screen remains the same
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <Award className="w-24 h-24 text-yellow-400 mb-4" />
            <h1 className="text-5xl font-bold mb-4">Quiz Complete!</h1>
            <p className="text-3xl text-gray-300 mb-8">Your Final Score: <span className="text-purple-400 font-bold">{score}</span></p>
            {/* ...Your dynamic leaderboard JSX... */}
            <button onClick={restartQuiz} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl">Play Again</button>
        </div>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2"><Target className="w-6 h-6 text-purple-400" /><span className="text-2xl font-bold">{score}</span></div>
          <div className="flex items-center space-x-2"><Clock className="w-6 h-6 text-purple-400" /><span className="text-2xl font-bold">{timer}</span></div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6"><div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div></div>
      </div>
      <div className="w-64 h-48 pointer-events-none z-10 flex items-center justify-center">
        {animationData && <Lottie animationData={animationData} loop={false} />}
      </div>
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">{currentQuestion.questionText}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              disabled={isAnswered}
              className={`p-6 rounded-lg text-lg font-semibold text-left transition-all duration-300 transform ${getAnswerClass(option)}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;