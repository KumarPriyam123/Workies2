import React from 'react';
import { Link } from 'react-router-dom';

// Simple particle background component reused from App.jsx
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

// Task Item component for displaying tasks in the preview section
const TaskItem = ({ name, time, category }) => {
  return (
    <div className={`task-item ${category}`}>
      <div className="task-content">
        <span className="task-name">{name}</span>
      </div>
      <div className="task-actions">
        <span className="task-time">{time}</span>
      </div>
    </div>
  );
};

// Landing Page component
const LandingPage = () => {
  // Sample tasks data
  const professionalTasks = [
    { id: 1, name: "Complete project proposal", time: "14:00", category: "professional" },
    { id: 2, name: "Team meeting", time: "15:30", category: "professional" },
  ];
  
  const personalTasks = [
    { id: 3, name: "Go for a run", time: "18:30", category: "personal" },
    { id: 4, name: "Call mom", time: "20:00", category: "personal" },
  ];
  
  const upcomingEvents = [
    { id: 5, name: "Client presentation", time: "10:00", date: "Tomorrow", category: "professional" },
    { id: 6, name: "Project deadline", time: "17:00", date: "In 4 days", category: "professional" },
    { id: 7, name: "Team building event", time: "13:00", date: "Next week", category: "personal" },
  ];
  
  return (
    <div className="landing-page">
      <ParticleBackground />
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container landing-navbar">
          <div className="navbar-logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">WorkEase</span>
          </div>
          
          <div className="auth-links">
            <Link to="/dashboard" className="auth-link">Login / Sign up</Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Achieve more, in efficient manner
          </h1>
          <div className="hero-cta">
            <Link to="/dashboard" className="cta-button">Get Started</Link>
          </div>
        </div>
      </section>
      
      {/* Task Preview Section */}
      <section className="task-preview-section">
        <div className="task-preview-container">
          <div className="task-preview-column">
            <div className="task-preview-card">
              <h2 className="preview-card-title">Professional Tasks</h2>
              <div className="preview-tasks">
                {professionalTasks.map(task => (
                  <TaskItem key={task.id} {...task} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="task-preview-column">
            <div className="task-preview-card">
              <h2 className="preview-card-title">Personal Tasks</h2>
              <div className="preview-tasks">
                {personalTasks.map(task => (
                  <TaskItem key={task.id} {...task} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="task-preview-column">
            <div className="task-preview-card">
              <h2 className="preview-card-title">Upcoming Events</h2>
              <div className="upcoming-events">
                {upcomingEvents.map(event => (
                  <div key={event.id} className={`upcoming-task ${event.category}`}>
                    <div className="task-details">
                      <span className="task-name">{event.name}</span>
                      <span className="task-date">{event.date}</span>
                    </div>
                    <span className="task-time">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="contact-section">
            <h3>Contact Us</h3>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Email">
                <i className="social-icon">✉️</i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="social-icon">🐦</i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="social-icon">👔</i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 