import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // ✅ FIX: handle non-JSON errors safely
      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Invalid server response" };
      }

      if (res.ok) {
        alert("✅ Signup successful");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed ❌");
      }

    } catch (err) {
      console.error("Signup error:", err);

      // ✅ FIX: clearer error
      alert("❌ Backend not running or wrong port");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSignup}>
        <h2>Signup</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;