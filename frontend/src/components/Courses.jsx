import React, { useState } from "react";
import API from "../utils/api";
import "../css/Courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCourses() {
    setLoading(true);
    try {
      const res = await API.get(`/courses${level ? `?level=${level}` : ""}`);
      setCourses(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  async function enroll(courseId) {
    try {
      await API.post("/enrollments", { course_id: courseId });
      alert("Successfully enrolled!");
    } catch (err) {
      alert(err.response?.data?.detail || "Enrollment failed");
    }
  }

  return (
    <div className="courses-container">
      <h2 className="courses-title">Available Courses</h2>
      <p className="courses-subtitle">Discover and enroll in courses that match your skill level</p>

      <div className="courses-controls">
        <select 
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
          className="courses-filter-select"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button 
          onClick={loadCourses} 
          className="courses-load-button"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Courses"}
        </button>
      </div>

      {loading ? (
        <div className="courses-loading">
          <div className="courses-spinner"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="courses-empty-state">
          <div className="courses-empty-icon">📚</div>
          <div className="courses-empty-text">No courses available</div>
          <div className="courses-empty-subtext">Try loading courses or check back later</div>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((c) => (
            <div key={c.id} className="courses-item">
              <div className="courses-item-image">
                <img 
                  src={c.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"} 
                  alt={c.title}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop";
                  }}
                />
                <div className="courses-item-level-badge">{c.level}</div>
              </div>
              <div className="courses-item-content">
                <h3 className="courses-item-title">{c.title}</h3>
                <p className="courses-item-description">{c.description}</p>
                <div className="courses-item-actions">
                  <button 
                    onClick={() => enroll(c.id)} 
                    className="courses-enroll-button"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
