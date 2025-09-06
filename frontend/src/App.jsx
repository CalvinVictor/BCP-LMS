import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import InstructorDashboard from "./pages/Instructorhome"; // already imported
import About from "./pages/about";
import UserProfile from "./pages/UserProfile";
import QuizPage from './pages/QuizPage';
import AdminHome from "./pages/AdminHome";
import CourseDetailPage from './pages/CourseDetailPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import LeaderboardPage from './pages/LeaderboardPage';
 // 🆕 import this if you haven't

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/instructorhome" element={<InstructorDashboard />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/test/:courseId" element={<QuizPage />} />
        <Route path="/course/:courseId" element={<CourseDetailPage />} />
        <Route path="/course-player/:courseId" element={<CoursePlayerPage />} />
        <Route path="/leaderboard/:courseId" element={<LeaderboardPage />} />
        <Route path="/quiz/:courseId" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
