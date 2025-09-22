import React, { useState } from "react";
import API from "../utils/api";
import "../css/Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function Auth({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isLogin) {
      
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[@$*&])/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character (@$*&)";
      }
    } else {
      
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem("token", res.data.access_token);
        setIsLoggedIn(formData.username);
      } else {
        await API.post("/auth/signup", {
          username: formData.username,
          password: formData.password
        });
        alert("Signup successful! Please login with your credentials.");
        setIsLogin(true);
        setFormData({
          username: formData.username,
          password: "",
          confirmPassword: ""
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
        (isLogin ? "Login failed" : "Signup failed");
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      password: "",
      confirmPassword: ""
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$*&]/.test(password)) strength++;
    
    const levels = [
      { strength: 0, text: "Very Weak", color: "#e74c3c" },
      { strength: 1, text: "Weak", color: "#e67e22" },
      { strength: 2, text: "Fair", color: "#f39c12" },
      { strength: 3, text: "Good", color: "#27ae60" },
      { strength: 4, text: "Strong", color: "#2ecc71" },
      { strength: 5, text: "Very Strong", color: "#27ae60" }
    ];
    
    return levels[strength] || levels[0];
  };

  return (
   

<div className="auth-container">
 
  <div className="auth-left">
    <h1 className="auth-portal-title">E-Learning Portal</h1>
    <p className="auth-portal-tagline">Empowering education, anytime, anywhere</p>
  </div>

  
  <div className="auth-card">
    <h2 className="auth-title">
      {isLogin ? "Welcome Back" : "Create Account"}
    </h2>
    <p className="auth-subtitle">
      {isLogin ? "Sign in to your account" : "Sign up for a new account"}
    </p>

    {!isLogin && (
      <div className="auth-password-requirements">
        <p>Password requirements:</p>
        <ul>
          <li>At least 8 characters</li>
          <li>Must contain @, $, *, or &</li>
        </ul>
      </div>
    )}

    {errors.general && (
      <div className="auth-error-alert">
        {errors.general}
      </div>
    )}

    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-input-group">
  <label className="auth-label">Username</label>
  <div className="auth-password-container">  
    <input
      type="text"
      name="username"
      value={formData.username}
      onChange={handleInputChange}
      className={`auth-input ${errors.username ? 'error' : ''}`}
      placeholder="Enter your username"
      disabled={loading}
    />
  </div>
  {errors.username && (
    <span className="auth-error-text">{errors.username}</span>
  )}
</div>


      <div className="auth-input-group">
        <label className="auth-label">Password</label>
        <div className="auth-password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`auth-input ${errors.password ? 'error' : ''}`}
            placeholder="Enter your password"
            disabled={loading}
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {!isLogin && formData.password && (
          <div className="auth-password-strength">
            <div className="auth-password-strength-bar">
              <div
                className="auth-password-strength-fill"
                style={{
                  width: `${(getPasswordStrength(formData.password).strength / 5) * 100}%`,
                  backgroundColor: getPasswordStrength(formData.password).color
                }}
              ></div>
            </div>
            <span
              className="auth-password-strength-text"
              style={{ color: getPasswordStrength(formData.password).color }}
            >
              {getPasswordStrength(formData.password).text}
            </span>
          </div>
        )}
        {errors.password && (
          <span className="auth-error-text">{errors.password}</span>
        )}
      </div>

      {!isLogin && (
        <div className="auth-input-group">
          <label className="auth-label">Confirm Password</label>
          <div className="auth-password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              disabled={loading}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="auth-error-text">{errors.confirmPassword}</span>
          )}
        </div>
      )}

      <button
        type="submit"
        className={`auth-submit-button ${loading ? 'disabled' : ''}`}
        disabled={loading}
      >
        {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
      </button>
    </form>

    <div className="auth-toggle-container">
      <span className="auth-toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
      </span>
      <button
        type="button"
        onClick={toggleMode}
        className="auth-toggle-button"
        disabled={loading}
      >
        {isLogin ? "Sign Up" : "Sign In"}
      </button>
    </div>
  </div>
</div>
  );
}
