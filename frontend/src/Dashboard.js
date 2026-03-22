import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    scam: 0,
    safe: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3600/admin/scams", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();

      let scam = 0;
      let safe = 0;

      result.forEach(item => {
        if (item.result === "Scam") scam++;
        else safe++;
      });

      setStats({
        total: result.length,
        scam,
        safe
      });

      setData([
        { name: "Safe", value: safe },
        { name: "Scam", value: scam }
      ]);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>📊 Scam Analytics Dashboard</h1>

      {/* 💎 CARDS */}
      <div style={cardContainer}>

        {/* CARD 1 */}
        <div
          style={glassCard}
          onMouseEnter={(e)=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={(e)=>e.currentTarget.style.transform="scale(1)"}
        >
          <h3>Total Checks</h3>
          <p>{stats.total}</p>
        </div>

        {/* CARD 2 */}
        <div
          style={glassCard}
          onMouseEnter={(e)=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={(e)=>e.currentTarget.style.transform="scale(1)"}
        >
          <h3>Scams Detected</h3>
          <p>{stats.scam}</p>
        </div>

        {/* CARD 3 */}
        <div
          style={glassCard}
          onMouseEnter={(e)=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={(e)=>e.currentTarget.style.transform="scale(1)"}
        >
          <h3>Safe Messages</h3>
          <p>{stats.safe}</p>
        </div>

      </div>

      {/* 📊 CHART */}
      <div style={chartCard}>
        <h2>📈 Scam vs Safe</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* 🌈 PAGE BACKGROUND */
const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
  color: "white"
};

/* 💎 CARD CONTAINER */
const cardContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  flexWrap: "wrap"
};

/* 🧊 GLASS CARD */
const glassCard = {
  flex: "1",
  minWidth: "200px",
  padding: "20px",
  borderRadius: "15px",
  backdropFilter: "blur(12px)",
  background: "rgba(255,255,255,0.15)",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  textAlign: "center",
  transition: "transform 0.3s ease",
  cursor: "pointer"
};

/* 📊 CHART CARD */
const chartCard = {
  marginTop: "40px",
  padding: "20px",
  borderRadius: "15px",
  backdropFilter: "blur(12px)",
  background: "rgba(255,255,255,0.15)",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
};

/* 🧠 TITLE */
const titleStyle = {
  textAlign: "center",
  fontSize: "32px"
};

export default Dashboard;