import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService"; // Ensure this path is correct
import "../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER", // Default role
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await signup(formData); // Call the signup API function

      if (!response || response.error) {
        throw new Error(response?.error || "Signup failed. Please try again.");
      }

      console.log("Signup successful!", response);
      navigate("/login"); // Redirect to Login page
    } catch (error) {
      console.error("Signup Error:", error.message);
      setError(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="body">
      <div className="login-container">
        <h2 className="logo-container5">
          <img src="/images/logo.png" alt="Artisan Alley Logo" className="logo5" />
          <span className="txt"> Welcome to Artisan Alley</span>
        </h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
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
          <div className="input-group">
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
          <div className="input-group">
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
          <button className="but" type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
