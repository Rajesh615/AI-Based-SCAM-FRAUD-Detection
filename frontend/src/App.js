import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Admin from "./Admin";

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e3c72, #2a5298)",
  color: "white",
  padding: "10px"
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "10px"
};

const navLink = {
  marginLeft: "20px",
  textDecoration: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

const buttonStyle = {
  marginTop: "20px",
  padding: "12px 25px",
  borderRadius: "8px",
  border: "none",
  background: "#ff4b2b",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  transition: "0.3s"
};

const resultCard = {
  marginTop: "30px",
  padding: "20px",
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  background: "rgba(255,255,255,0.15)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
};

/* ================= HOME ================= */

function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResult("🔍 Analyzing...");

    try {
      const [ruleRes, aiRes, explainRes] = await Promise.all([
        fetch("http://localhost:3600/check-scam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        }),
        fetch("http://localhost:3600/detect-scam-ml", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        }),
        fetch("http://localhost:3600/explain-scam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        })
      ]);

      const ruleData = await ruleRes.json();
      const aiData = await aiRes.json();
      const explainData = await explainRes.json();

      let probability = ruleData.probability || 0;

      let color = "green";
      if (probability > 60) color = "red";
      else if (probability > 30) color = "orange";

      setResult(`
        <h2 style="color:${color}">Scam Probability: ${probability}%</h2>
        <p><b>Suspicious Words:</b> ${ruleData.suspicious?.join(", ") || "None"}</p>
        <h3>🤖 AI Result: ${aiData.result} (${aiData.confidence})</h3>
        <h3>🧠 Explanation:</h3>
        <p>${(explainData.explanation || "").replace(/\n/g, "<br>")}</p>
      `);

    } catch (err) {
      setResult("❌ Error connecting to server");
    }
  };

  return (
    <div style={pageStyle}>

      {/* 🔥 NAVBAR */}
      <div style={navStyle}>
        <span style={{ fontSize: "20px" }}>🛡 AI Scam Detector</span>

        <div>
          <Link to="/" style={navLink}>Home</Link>
          <Link to="/dashboard" style={navLink}>Dashboard</Link>
          <Link to="/login" style={navLink}>Admin</Link>
        </div>
      </div>

      {/* HEADER */}
      <h1 style={{ textAlign: "center", marginTop: "30px" }}>
        🛡 AI Scam Detector
      </h1>

      <p style={{ textAlign: "center", opacity: "0.8" }}>
        Smart protection against online scams
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto", marginTop: "30px" }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste WhatsApp, Email, or SMS message..."
          style={{
            width: "100%",
            height: "120px",
            borderRadius: "10px",
            padding: "15px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            backdropFilter: "blur(8px)"
          }}
        />

        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e)=>e.target.style.transform="scale(1.1)"}
            onMouseLeave={(e)=>e.target.style.transform="scale(1)"}
          >
            🚀 Check Scam
          </button>
        </div>
      </form>

      {/* RESULT */}
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <div style={resultCard}>
          <div dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      </div>

    </div>
  );
}

/* ================= APP ROUTES ================= */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;