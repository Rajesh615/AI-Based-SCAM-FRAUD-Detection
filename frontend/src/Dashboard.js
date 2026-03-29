import React, { useState, useEffect } from "react";
import API from "./api";
import { Link } from "react-router-dom";
import "./App.css";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [, setResult] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    // ✅ Load history
    const saved = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setHistory(saved);

    // 🔥 PRE-WARM BACKEND
    fetch("https://ai-based-scam-fraud-detection.onrender.com/")
      .then(() => console.log("Server warmed up 🔥"))
      .catch(() => console.log("Wake failed"));
  }, []);

  const saveHistory = (newItem) => {
    const updated = [newItem, ...history];
    setHistory(updated);
    localStorage.setItem("chatHistory", JSON.stringify(updated));
  };

  const handleCheck = async () => {
    if (!message.trim()) {
      alert("Enter message");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setResult(null);

      const res = await API.post(
        "/api/check",
        { message },
        { timeout: 30000 }
      );

      setResult(res.data);

      saveHistory({
        text: message,
        result: res.data
      });

      setMessage("");
      setLoading(false);

    } catch (error) {
      console.error(error);
      alert("Server waking up... please try again");
      setLoading(false);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setHistory([]);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "scam-report.json";
    a.click();
  };

  return (
    <div className="chat-container">

      {/* MENU */}
      <div className="menu-btn" onClick={() => setMenuOpen(true)}>
        &#9776;
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <h3>Menu</h3>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>

        <button onClick={clearHistory}>🧹 Clear Chat</button>
        <button onClick={exportData}>📄 Download Report</button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      <h1 className="title">🛡 AI Scam Detector</h1>

      {/* RESULTS */}
      <div className="chat-messages">

        {loading && (
          <p className="empty">🤖 AI is analyzing...</p>
        )}

        {history.map((item, index) => {
          const prob = item.result?.probability || 0;

          // 🎯 COLOR LOGIC
          const borderColor =
            prob > 60 ? "#ff4d4d" :
            prob > 40 ? "#f1c40f" :
            "#39ff14";

          // 🎯 RESULT LOGIC (FIXED)
          const resultText =
            prob > 60 ? "Scam" :
            prob > 40 ? "Suspicious" :
            "Safe";

          return (
            <div
              key={index}
              className="result-card"
              style={{
                border: `2px solid ${borderColor}`,
                boxShadow: `0 0 10px ${borderColor}`
              }}
            >
              <p><b>Message:</b> {item.text}</p>

              <h3 style={{ color: borderColor }}>
                Scam Probability: {prob}%
              </h3>

              {item.result.keywords?.length > 0 && (
                <p>
                  <b>Suspicious Words:</b>{" "}
                  {item.result.keywords.join(", ")}
                </p>
              )}

              {/* ✅ FIXED RESULT DISPLAY */}
              <p>
                <b>Result:</b>{" "}
                <span
                  style={{
                    color: borderColor,
                    fontWeight: "bold"
                  }}
                >
                  {resultText}
                </span>
              </p>

              {item.result.explanation?.length > 0 && (
                <>
                  <p><b>Explanation:</b></p>
                  <ul>
                    {item.result.explanation.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          );
        })}

        {!loading && history.length === 0 && (
          <p className="empty">Start detecting scams 💡</p>
        )}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={handleCheck} disabled={loading}>
          {loading ? "Checking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;