import React, { useState } from "react";
import API from "../utils/api";
import "../css/Enrollments.css";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);

  const progressLevels = [20, 40, 60, 80, 100];

  async function loadEnrollments() {
    setLoading(true);
    try {
      const res = await API.get("/me/enrollments");
      setEnrollments(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  }

  async function updateProgress(id, progress) {
    try {
      await API.patch(`/enrollments/${id}/progress`, { progress_pct: progress });
      alert(`Progress updated to ${progress}%`);
      loadEnrollments();
    } catch (err) {
      alert(err.response?.data?.detail || "Update failed");
    }
  }

  const getProgressLevelClass = (progress) => {
    if (progress >= 100) return 'progress-level-100';
    if (progress >= 80) return 'progress-level-80';
    if (progress >= 60) return 'progress-level-60';
    if (progress >= 40) return 'progress-level-40';
    if (progress >= 20) return 'progress-level-20';
    return '';
  };

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="enrollments-container">
      <h2 className="enrollments-title">My Enrollments</h2>
      <p className="enrollments-subtitle">Track your learning progress and update your completion status</p>
      
      <button 
        onClick={loadEnrollments} 
        className="enrollments-load-button"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load My Enrollments"}
      </button>

      {loading ? (
        <div className="enrollments-loading">
          <div className="enrollments-spinner"></div>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="enrollments-empty-state">
          <div className="enrollments-empty-icon">📖</div>
          <div className="enrollments-empty-text">No enrollments found</div>
          <div className="enrollments-empty-subtext">Enroll in courses to see them here</div>
        </div>
      ) : (
        <ul className="enrollments-list">
          {enrollments.map((e) => (
            <li key={e.id} className="enrollments-item">
              <div className="enrollments-item-header">
                <div className="enrollments-course-info">
                  <h3 className="enrollments-item-title">{e.course.title}</h3>
                  <span className="enrollments-course-level">{e.course.level}</span>
                </div>
                <button
                  className="enrollments-expand-button"
                  onClick={() => toggleCourseExpansion(e.id)}
                >
                  {expandedCourse === e.id ? "▼" : "▶"}
                </button>
              </div>
              
              <div className="enrollments-course-description">
                <p>{e.course.description}</p>
              </div>
              
              {expandedCourse === e.id && (
                <div className="enrollments-progress-section">
                  <div className="enrollments-progress-label">
                    <span>Current Progress</span>
                    <span className="enrollments-progress-percentage">{e.progress_pct}%</span>
                  </div>
                  
                  <div className="enrollments-progress-bar">
                    <div 
                      className={`enrollments-progress-fill ${getProgressLevelClass(e.progress_pct)}`}
                      style={{ width: `${e.progress_pct}%` }}
                    ></div>
                  </div>
                  
                  <div className="enrollments-progress-controls">
                    <h4>Update Progress</h4>
                    <p>Select your current completion level:</p>
                    <div className="enrollments-progress-buttons">
                      {progressLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() => updateProgress(e.id, level)}
                          className={`enrollments-progress-button ${
                            e.progress_pct === level ? 'active' : ''
                          }`}
                          disabled={e.progress_pct === level}
                        >
                          {level}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
