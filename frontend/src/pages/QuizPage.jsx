import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import { Target, Clock, Award } from 'lucide-react';
import * as THREE from "three";
//import BIRDS from "vanta/dist/vanta.birds.min.js";

import apiService from '../services/apiService';
import cheerAnimation from '../assets/animations/cheer.json';
import frownAnimation from '../assets/animations/frown.json';

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  const [quiz, setQuiz] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizState, setQuizState] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(15);
  const [animationData, setAnimationData] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);

/*  useEffect(() => {
    const vantaEffect = BIRDS({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0x7092f,
      color1: 0x300de8,
      color2: 0xd4ff,
      colorMode: "variance",
      separation: 59.00,
      alignment: 46.00,
      cohesion: 17.00,
    });
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []); */

  useEffect(() => {
    setIsLoading(true);
  setQuizState('start');
  setCurrentQuestionIndex(0);
  setScore(0);
  setSelectedAnswer(null);
  setIsAnswered(false);
  setTimer(15);
  setStartTime(null);
  setError(null);
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

  // In QuizPage.js

useEffect(() => {
  // This code only runs when quizState changes to 'finished'
  if (quizState === 'finished' && startTime) {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    // This console log will now show the TRUE final score
    console.log("🎯 Final score being submitted:", score);
    console.log("⏱️ Time taken being submitted:", timeTaken);

    // Make the API call here, now that we have the final score
    apiService.submitTestResult(courseId, { score: score, timeTaken: timeTaken })
      .then(() => {
        console.log("✅ Score saved successfully!");
        apiService.getLeaderboard(courseId).then(setLeaderboard);
      })
      .catch(err => console.error("❌ Failed to save score:", err));
  }
}, [quizState]); // This hook depends ONLY on quizState


  useEffect(() => {
    if (quizState === 'active' && !isAnswered) {
      if (timer > 0) {
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
      } else {
        handleAnswerClick(null, true);
      }
    }
  }, [quizState, isAnswered, timer]);

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

  // In QuizPage.js, replace the old function with this one

const handleNextQuestion = () => {
  setAnimationData(null);
  const nextQuestionIndex = currentQuestionIndex + 1;

  if (nextQuestionIndex < quiz.questions.length) {
    setCurrentQuestionIndex(nextQuestionIndex);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimer(15);
  } else {
    // We ONLY change the state here. The useEffect hook will do the rest.
    setQuizState('finished');
  }
};

  // In QuizPage.js

const restartQuiz = () => {
  setQuizState('start');
  setCurrentQuestionIndex(0);
  setScore(0);
  setSelectedAnswer(null);
  setIsAnswered(false);
  setTimer(15);
  setAnimationData(null);
  setStartTime(null);
  setLeaderboard(null);
};

  const getAnswerClass = (option) => {
    if (!isAnswered) return 'bg-gray-800 hover:bg-purple-700';
    const correctAnswer = quiz.questions[currentQuestionIndex].correctAnswer;
    if (option === correctAnswer) return 'bg-green-500 text-white animate-jiggle'; 
    if (option === selectedAnswer) return 'bg-red-500 text-white animate-shake';
    return 'bg-gray-700 bg-opacity-50';
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-2xl font-bold">Loading Quiz...</p>;
    }
    if (error) {
      return <p className="text-2xl font-bold text-red-500">{error}</p>;
    }
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      return <p className="text-2xl font-bold">No quiz questions found for this course.</p>;
    }

    if (quizState === 'start') {
      return (
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 text-purple-400">Ready to Test Your Knowledge?</h1>
          <h2 className="text-2xl text-gray-300 mb-8">{quiz.title}</h2>
          <p className="text-lg mb-8 max-w-2xl text-center text-gray-400">You have 15 seconds for each question. Answer quickly for bonus points!</p>
          <button 
            onClick={() => {
              setQuizState('active');
              setStartTime(Date.now()); // ✅ Records when the quiz starts
            }} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-lg text-2xl"
          >
            Start Quiz
          </button>
        </div>
      );
    }

    if (quizState === 'finished') {
      // Logic to check if the current user is in the top 3
      const userId = localStorage.getItem("userId"); // You need to get this from localStorage or context
      const userInTop3 = leaderboard?.some(entry => entry.student._id === userId);

      return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
          <Award className="w-24 h-24 text-yellow-400 mb-4" />
          <h1 className="text-5xl font-bold mb-4">Quiz Complete!</h1>
          <p className="text-3xl text-gray-300 mb-8">Your Final Score: <span className="text-purple-400 font-bold">{score}</span></p>
          
          <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-center mb-4"></h2>
            <div className="space-y-3">
              
              
            </div>
            {/* Certificate Message */}
            {userInTop3 && (
             <p className="text-center text-lg font-bold text-white mt-6 animate-pulse">
                Congratulations! You've completed the test! Check leaderboard to see if you earned a certificate!
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(`/leaderboard/${courseId}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl"
          >
            View Leaderboard
          </button>
        </div>
      );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-purple-400" />
            <span className="text-2xl font-bold">{score}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-purple-400" />
            <span className="text-2xl font-bold">{timer}</span>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="w-64 h-48 pointer-events-none z-10 flex items-center justify-center mx-auto">
          {animationData && <Lottie animationData={animationData} loop={false} />}
        </div>
        <div className="w-full bg-gray-800 p-8 rounded-lg shadow-2xl">
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      <div ref={vantaRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 text-white flex flex-col items-center justify-center p-4 min-h-screen">
        {renderContent()}
      </div>
    </div>
  );
};

export default QuizPage;