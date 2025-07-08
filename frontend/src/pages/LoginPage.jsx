import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SocialLogin from "../Components/SocialLogin";
import InputField from "../Components/InputField";
import RoleToggle from "../Components/RoleToggle";
import "./LoginPage.css";
import "./LoginPageBackground.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logged in as:", role);
    navigate("/home"); // Update later with role-based navigation
  };

  return (
    <div className="page-wrapper">
      {/* Background video */}
      <video autoPlay muted loop playsInline className="background-video">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login panel */}
      <div className="login-container">
        {/* Small animation video inside container */}
        <div className="container-video-wrapper">
          <video autoPlay muted loop playsInline className="container-video">
            <source src="/login-animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h2 className="form-title">Log in with</h2>
        <SocialLogin />
        <p className="separator"><span>or</span></p>

        <form onSubmit={handleSubmit} className="login-form">
          <InputField type="email" placeholder="Email address" icon="mail" />
          <InputField type="password" placeholder="Password" icon="lock" />
          <RoleToggle role={role} setRole={setRole} />
          <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
          <button type="submit" className="login-button">Log In</button>
        </form>

        <p className="signup-prompt">
          Don&apos;t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
