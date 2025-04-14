import axios from "axios";
import "../styles/summary.css";
import Sidebar from "../pages/Sidebar";
import React, { useState, useEffect } from "react";

const ArtisanSummaryPage = () => {
  const [artisanData, setArtisanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/attendance/admin/all");
        // Simulate loading for demo purposes
        setTimeout(() => {
          setArtisanData(response.data);
          setLoading(false);
          
          // Initialize counters for animation
          const initialCounters = {};
          response.data.forEach((artisan, index) => {
            initialCounters[`earning-${index}`] = 0;
            initialCounters[`days-${index}`] = 0;
          });
          setAnimatedValues(initialCounters);
          
          // Start counter animations after data loads
          animateCounters(response.data);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch artisan summary", error);
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, []);
  
  // Animate counters for days and earnings
  const animateCounters = (data) => {
    data.forEach((artisan, index) => {
      const targetDays = artisan[2];
      const targetEarnings = artisan[3];
      
      // Animate working days
      let daysCounter = 0;
      const daysInterval = setInterval(() => {
        daysCounter += 1;
        setAnimatedValues(prev => ({
          ...prev,
          [`days-${index}`]: daysCounter
        }));
        
        if (daysCounter >= targetDays) {
          clearInterval(daysInterval);
          setAnimatedValues(prev => ({
            ...prev,
            [`days-${index}`]: targetDays
          }));
        }
      }, 50);
      
      // Animate earnings with a slightly faster interval
      let earningsCounter = 0;
      const earningsStep = Math.max(1, Math.floor(targetEarnings / 20));
      const earningsInterval = setInterval(() => {
        earningsCounter += earningsStep;
        setAnimatedValues(prev => ({
          ...prev,
          [`earning-${index}`]: earningsCounter
        }));
        
        if (earningsCounter >= targetEarnings) {
          clearInterval(earningsInterval);
          setAnimatedValues(prev => ({
            ...prev,
            [`earning-${index}`]: targetEarnings
          }));
        }
      }, 40);
    });
  };

  // Create shimmer loading placeholders
  const renderLoadingRows = () => {
    return Array(5).fill(0).map((_, index) => (
      <tr key={`loading-${index}`}>
        <td className="shimmer" style={{ height: "20px", width: "30px" }}></td>
        <td className="shimmer" style={{ height: "20px", width: "120px" }}></td>
        <td className="shimmer" style={{ height: "20px", width: "50px" }}></td>
        <td className="shimmer" style={{ height: "20px", width: "80px" }}></td>
      </tr>
    ));
  };

  return (
    <div className="page-wrapper">
      <Sidebar className="sidebar" />
      <div className="summary-content">
        <h2 className="main-heading">💰 Artisan Total Earnings</h2>
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Working Days</th>
                <th>Total Earnings</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderLoadingRows()
              ) : artisanData.length > 0 ? (
                artisanData.map((artisan, index) => (
                  <tr key={index}>
                    <td>{artisan[0]}</td>
                    <td>{artisan[1]}</td>
                    <td className="count-animation">
                      {animatedValues[`days-${index}`] || 0}
                    </td>
                    <td className={`count-animation ${animatedValues[`earning-${index}`] === artisan[3] ? 'highlight-total' : ''}`}>
                      ₹{animatedValues[`earning-${index}`] || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="status-msg">No artisan data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && artisanData.length > 0 && (
          <div className="summary-footer">
            <p className="status-msg">
              Showing earnings for {artisanData.length} artisans
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanSummaryPage;