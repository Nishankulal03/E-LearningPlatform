import React from "react";
import "../css/Navbar.css";

export default function Navbar({ isLoggedIn, onLogout, currentUser }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <span className="navbar-logo-icon">🎓</span>
          <h2 className="navbar-logo-text">E-Learning Platform</h2>
        </div>
        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="navbar-user-section">
              <span className="navbar-welcome-text">
                Welcome, <strong>{currentUser || "User"}</strong>!
              </span>
              <button onClick={onLogout} className="navbar-logout-button">
                Logout
              </button>
            </div>
          ) : (
            <span className="navbar-login-prompt">Please sign in to continue</span>
          )}
        </div>
      </div>
    </nav>
  );
}
