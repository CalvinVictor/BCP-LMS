import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import SocialLogin from "../Components/SocialLogin";
import InputField from "../Components/InputField";
import RoleToggle from "../Components/RoleToggle";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    // Initialize Vanta.js effect
    if (!vantaEffect.current) {
      vantaEffect.current = NET({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x5f41e4,
        backgroundColor: 0x1e1e2e,
        points: 10.0,
        maxDistance: 23.0,
        spacing: 17.0
      });
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logged in as:", role);
    navigate("/home");
  };

  return (
    <div className="page-wrapper">
      {/* Vanta.js background */}
      <div ref={vantaRef} className="vanta-background"></div>

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