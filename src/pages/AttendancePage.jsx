import axios from "axios";
import React, { useState, useEffect } from "react";
import "../styles/attendances.css";
import Sidebar from "../pages/Sidebar";

const AttendancePage = () => {
  const [artisans, setArtisans] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [message, setMessage] = useState("");
  const [dailySummary, setDailySummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [animateMessage, setAnimateMessage] = useState(false);

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/artisan/artisans");
        // Simulate loading for demo purposes
        setTimeout(() => {
          setArtisans(response.data);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching artisans", error);
        setLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  const handleStatusChange = (artisanId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [artisanId]: status,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const promises = Object.entries(attendanceMap).map(([artisanId, isPresent]) =>
        axios.post(`http://localhost:8080/api/attendance/mark/${artisanId}?present=${isPresent}`)
      );
      await Promise.all(promises);
      // Reset animation state first to trigger animation even when message content doesn't change
      setMessage("");
      setAnimateMessage(false);
      
      // Small timeout to ensure DOM updates before starting new animation
      setTimeout(() => {
        setMessage("✅ Attendance marked successfully.");
        setAnimateMessage(true);
        fetchSummary(); // Refresh summary after submission
      }, 50);
    } catch (error) {
      console.error("Error marking attendance", error);
      setMessage("");
      setAnimateMessage(false);
      
      setTimeout(() => {
        setMessage("❌ Error marking attendance.");
        setAnimateMessage(true);
      }, 50);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/attendance/daily-summary");
      setDailySummary(response.data);
    } catch (error) {
      console.error("Error fetching summary by date", error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Create shimmer loading placeholders
  const renderLoadingRows = () => {
    return Array(5).fill(0).map((_, index) => (
      <tr key={`loading-${index}`}>
        <td className="shimmer" style={{ height: "20px", width: "30px" }}></td>
        <td className="shimmer" style={{ height: "20px", width: "120px" }}></td>
        <td className="shimmer" style={{ height: "20px", width: "60px" }}></td>
      </tr>
    ));
  };

  return (
    <div className="page-wrapper">
      <Sidebar className="sidebar" />
      <div className="attendance-content">
        <h2 className="main-heading">📅 Mark Artisan Attendance</h2>
        
        <table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {loading 
              ? renderLoadingRows()
              : artisans.map((artisan) => (
                <tr key={artisan.id}>
                  <td>{artisan.id}</td>
                  <td>{artisan.username}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={attendanceMap[artisan.id] === true}
                        onChange={(e) => handleStatusChange(artisan.id, e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        
        <button 
          className="submit-btn" 
          onClick={handleSubmit} 
          disabled={submitting || loading}
        >
          {submitting ? 'Submitting...' : 'Submit Attendance'}
        </button>
        
        {message && (
          <p className={`status-msg ${animateMessage ? 'fadeInBounce' : ''}`}>
            {message}
          </p>
        )}
        
        <h3 className="history-heading">📆 Attendance History</h3>
        
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(dailySummary).length === 0 ? (
              renderLoadingRows()
            ) : (
              Object.keys(dailySummary).map((date) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{dailySummary[date].present}</td>
                  <td>{dailySummary[date].absent}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;