import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h2>LMS Learning</h2>
        <div className="nav-buttons">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button>My Courses</button>
          <button>Logout</button>
        </div>
      </header>

      <section className="welcome-section">
        <h1>Welcome, Calvin!</h1>
        <p>Continue your learning journey.</p>
      </section>

      <section className="courses-section">
        <h3>Your Courses</h3>
        <div className="course-cards">
          <div className="course-card">
            <img src="course1.png" alt="Course 1" />
            <h4>React Basics</h4>
            <button>Continue</button>
          </div>
          <div className="course-card">
            <img src="course2.png" alt="Course 2" />
            <h4>AWS Fundamentals</h4>
            <button>Start</button>
          </div>
          {/* Add more cards */}
        </div>
      </section>
    </div>
  );
}

export default Home;
