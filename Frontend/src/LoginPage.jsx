import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Simple particle background component reused from other pages
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    // For demo purposes, just redirect to dashboard
    // In a real app, you would validate credentials with a backend
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
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to your WorkEase account</p>
          
          {errorMsg && <div className="auth-error">{errorMsg}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
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
              Login
            </button>
          </form>
          
          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>
          
          <Link to="/signup" className="auth-link-button">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 