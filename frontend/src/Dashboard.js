import React, { useState } from "react";
import API from "./api";
import { Link } from "react-router-dom";
import "./App.css";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/check",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
      setMessage("");

    } catch (err) {
      console.log("Check error:", err.response?.data || err.message);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">

      {/* ☰ MENU BUTTON */}
      <div className="menu-btn" onClick={() => setMenuOpen(true)}>
        &#9776;
      </div>

      {/* OVERLAY */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* SIDEBAR */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <h3>Menu</h3>

        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔥 HEADER */}
      <h1 className="title">🛡 AI Scam Detector</h1>

      {/* 🔥 RESULT AREA */}
      <div className="chat-messages">
        {!result ? (
          <p className="empty">Start detecting scams 💡</p>
        ) : (
          <div
            className="result-card"
            style={{
              border:
                result?.probability > 70
                  ? "2px solid #ff4d4d"
                  : result?.probability > 40
                  ? "2px solid #f1c40f"
                  : "2px solid #39ff14",
            }}
          >
            <h2
              style={{
                color:
                  result.probability > 70
                    ? "#ff4d4d"
                    : result.probability > 40
                    ? "#f1c40f"
                    : "#39ff14",
              }}
            >
              Scam Probability: {result.probability}%
            </h2>

            {result.keywords && (
              <p>
                <b>Suspicious Words:</b>{" "}
                {result.keywords.map((word, i) => (
                  <span key={i} style={{ color: "#ff4d4d", marginRight: "6px" }}>
                    {word}
                  </span>
                ))}
              </p>
            )}

            <p>
              <b>Result:</b>{" "}
              <span
                style={{
                  color: result.result === "Scam" ? "#ff4d4d" : "#39ff14",
                  fontWeight: "bold",
                }}
              >
                {result.result}
              </span>
            </p>

            {result.explanation && (
              <>
                <p><b>Explanation:</b></p>
                <ul>
                  {result.explanation.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {/* 🔥 INPUT AREA */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={handleCheck}>
          {loading ? "Checking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;