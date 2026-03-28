import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // ✅ FIXED URL
      const res = await axios.post("https://ai-based-scam-fraud-detection.onrender.com/api/auth/login", {
        email,
        password,
      });

      console.log(res.data);

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      alert("✅ Login successful");
      navigate("/dashboard");

    } catch (err) {
      console.log("Login error:", err.response?.data);

      // ✅ Better error handling
      alert(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Login</h2>

        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;