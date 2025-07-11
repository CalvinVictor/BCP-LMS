import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import SocialLogin from "../Components/SocialLogin";
import InputField from "../Components/InputField";
import RoleToggle from "../Components/RoleToggle";
import "./LoginPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
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

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!passwordMatch) {
      alert("Passwords do not match!");
      return;
    }
    
    if (!termsAccepted) {
      alert("Please accept the terms and conditions!");
      return;
    }

    console.log("Signed up as:", role, formData);
    navigate("/home"); // Navigate to home after successful signup
  };



  return (
    <div className="page-wrapper">
      {/* Vanta.js background */}
      <div ref={vantaRef} className="vanta-background"></div>

      {/* Signup panel */}
      <div className="login-container" style={{ height: 'auto', minHeight: '700px' }}>
        {/* Small animation video inside container */}
        <div className="container-video-wrapper">
          <video autoPlay muted loop playsInline className="container-video">
            <source src="/signup-animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h2 className="form-title">Sign up with</h2>
        <SocialLogin />
        <p className="separator"><span>or</span></p>

        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <InputField
              type="text"
              placeholder="First name"
              icon="user"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
            <InputField
              type="text"
              placeholder="Last name"
              icon="user"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>

          <InputField
            type="email"
            placeholder="Email address"
            icon="mail"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />

          <InputField
            type="password"
            placeholder="Password"
            icon="lock"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />

          <InputField
            type="password"
            placeholder="Confirm password"
            icon="lock"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            style={{
              borderColor: !passwordMatch && formData.confirmPassword ? '#ff6b6b' : undefined
            }}
          />

          {!passwordMatch && formData.confirmPassword && (
            <p style={{
              color: '#ff6b6b',
              fontSize: '0.875rem',
              marginTop: '-1rem',
              marginBottom: '1rem'
            }}>
              Passwords do not match
            </p>
          )}

          <RoleToggle role={role} setRole={setRole} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{
                accentColor: '#5F41E4',
                width: '16px',
                height: '16px'
              }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.875rem', color: '#6652BE' }}>
              I agree to the{' '}
              <Link to="/terms" style={{ color: '#5F41E4', textDecoration: 'underline' }}>
                Terms and Conditions
              </Link>
              {' '}and{' '}
              <Link to="/privacy" style={{ color: '#5F41E4', textDecoration: 'underline' }}>
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={!termsAccepted || !passwordMatch}
            style={{
              opacity: (!termsAccepted || !passwordMatch) ? 0.6 : 1,
              cursor: (!termsAccepted || !passwordMatch) ? 'not-allowed' : 'pointer'
            }}
          >
            Sign Up
          </button>
        </form>

        <p className="signup-prompt">
          Already have an account? <Link to="/login" className="signup-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;