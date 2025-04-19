import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Simple particle background component
const ParticleBackground = () => {
  return (
    <div className="particle-background">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workField, setWorkField] = useState('');
  const [education, setEducation] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Work field options
  const workFields = [
    'Tech', 
    'Education', 
    'Healthcare', 
    'Law', 
    'Government', 
    'Student',
    'Others'
  ];

  // Education options
  const educationOptions = [
    'Matric', 
    'Inter', 
    'UG', 
    'Graduate', 
    'Post Graduate'
  ];

  const handleEducationToggle = (option) => {
    if (education.includes(option)) {
      setEducation(education.filter(item => item !== option));
    } else {
      setEducation([...education, option]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!name || !email || !password || !workField || education.length === 0) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    // For demo purposes, just redirect to dashboard
    // In a real app, you would send this data to a backend
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <ParticleBackground />
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">WorkEase</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Auth Form */}
      <div className="auth-container">
        <div className="auth-card signup-card">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to start using WorkEase</p>
          
          {errorMsg && <div className="auth-error">{errorMsg}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="workField">Work Field</label>
              <select
                id="workField"
                value={workField}
                onChange={(e) => setWorkField(e.target.value)}
                className="auth-input"
              >
                <option value="" disabled>Select your field</option>
                {workFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Education</label>
              <div className="education-pills">
                {educationOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`education-pill ${education.includes(option) ? 'active' : ''}`}
                    onClick={() => handleEducationToggle(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="auth-button">
              Sign Up
            </button>
          </form>
          
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>
          
          <Link to="/login" className="auth-link-button">
            Login Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 