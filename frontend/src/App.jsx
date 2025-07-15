import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import InstructorDashboard from "./pages/Instructorhome"; // already imported
import About from "./pages/about";
import UserProfile from "./pages/UserProfile";
 // 🆕 import this if you haven't

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/instructorhome" element={<InstructorDashboard />} />
      
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
