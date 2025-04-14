import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { artisanSignup } from "../services/authService1"; // Import artisan signup function
import "../styles/Signup1.css"; // Updated styling file

const Signup1 = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "ARTISAN",
    location: "",
    skill: "",
    rating: "",
    name: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await artisanSignup(formData); // Call the artisan signup API function
      console.log("Signup Response:", response);

      if (response.error) {
        throw new Error(response.error);
      }

      console.log("Signup successful!");
      navigate("/login"); // Redirect to Login page
    } catch (error) {
      console.error("Signup Error:", error.message);
      setError(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup1-body">
      <div className="signup1-container">
        <h2 className="signup1-header">
          <img src="/images/logo.png" alt="Artisan Alley Logo" className="signup1-logo" />
          <span className="signup1-title">Welcome to Artisan Alley</span>
        </h2>
        {error && <p className="signup1-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="signup1-input-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter your full name" 
              required 
            />
          </div>
          <div className="signup1-input-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Enter your username" 
              required 
            />
          </div>
          <div className="signup1-input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email address" 
              required 
            />
          </div>
          <div className="signup1-input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Create a strong password" 
              required 
            />
          </div>
          <div className="signup1-input-group">
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="Enter your location" 
              required 
            />
          </div>
          <div className="signup1-input-group">
            <label htmlFor="skill">Skill</label>
            <input 
              type="text" 
              id="skill" 
              name="skill" 
              value={formData.skill} 
              onChange={handleChange} 
              placeholder="Enter your skill (e.g., Woodworker, Potter)" 
              required 
            />
          </div>
          <div className="signup1-input-group">
            <label htmlFor="rating">Rating</label>
            <input 
              type="number" 
              id="rating" 
              name="rating" 
              value={formData.rating} 
              onChange={handleChange} 
              placeholder="Rate your expertise (1-5)" 
              min="1" 
              max="5" 
              step="0.1"
              required 
            />
          </div>
          <button type="submit" className="signup1-button">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/login" className="signup1-link">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup1;
