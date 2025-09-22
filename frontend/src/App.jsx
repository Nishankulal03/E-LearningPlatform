import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import Courses from "./components/Courses";
import Enrollments from "./components/Enrollments";
import "./css/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState("");

  // Get username from token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT token to get username
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload.sub);
      } catch (error) {
        console.error("Error decoding token:", error);
        // If token is invalid, remove it
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentUser("");
  }

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  return (
    <div className="app-container">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={logout} 
        currentUser={currentUser}
      />
      {!isLoggedIn ? (
        <Auth setIsLoggedIn={handleLogin} />
      ) : (
        <div className="app-main-content">
          <div className="app-section">
            <Courses />
          </div>
          <div className="app-section">
            <Enrollments />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
