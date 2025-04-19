import React, { useState } from 'react';
import '../styles/Enrolment.css';
import Sidebar from "../pages/Sidebar";

const Enrolment = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    name: '',
    location: '',
    skill: '',
    rating: 4.5,
    role: 'ARTISAN'
  });
  
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/artisan/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setNotification({
          show: true,
          message: 'Artisan successfully enrolled!',
          type: 'success'
        });
        
        // Reset form after successful submission
        setFormData({
          userName: '',
          email: '',
          password: '',
          name: '',
          location: '',
          skill: '',
          rating: 4.5,
          role: 'ARTISAN'
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll artisan');
      }
    } catch (error) {
      setNotification({
        show: true,
        message: `Error: ${error.message}`,
        type: 'error'
      });
    }
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  return (
    <div className="artisan-enrollment-container">
      <Sidebar className="sidebarrrr" />
      <div className="enrollment-content">
        <div className="enrollment-card">
          <div className="card-header">
            <h1>Artisan Enrollment</h1>
            <p>Add a new artisan to the platform</p>
          </div>
          
          {notification.show && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="userName">Username</label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="City, Country"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="skill">Skill/Craft</label>
                <input
                  type="text"
                  id="skill"
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group rating-group">
              <label htmlFor="rating">Initial Rating (1-5)</label>
              <div className="rating-container">
                <input
                  type="range"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="rating-slider"
                />
                <span className="rating-value">{formData.rating}</span>
              </div>
            </div>
            
            <button type="submit" className="submit-button">
              Enroll Artisan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Enrolment;