import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/Login.css"; // Ensure correct path for CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      // Store user information in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.userId); // Change to "user_id" to match DashboardUser 

      // Debugging logs
      console.log("User ID:", data.userId);
      console.log("Role:", data.role);

      // Check if there's a redirect URL saved in localStorage
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      
      if (redirectUrl) {
        // Clear the saved redirect URL
        localStorage.removeItem("redirectAfterLogin");
        // Navigate to the product page
        navigate(redirectUrl);
      } else {
        // Navigate based on role
        switch (data.role) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "USER":
            navigate("/user");
            break;
          case "ARTISAN":
            navigate("/artisan");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className='login-page'>  
      <div className="login-box">  
        <div className="logo-containerrrr">
          <img src="/images/logo.png" alt="Artisan Alley Logo" className="logo2" />
          <h2>Welcome to Indiart</h2>
        </div>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="input-field"  
              value={email} 
              placeholder="Enter your email address" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="input-field"  
              value={password} 
              placeholder="Enter your Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn1">Login</button>  
        </form>
        <p className="login-footer">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;