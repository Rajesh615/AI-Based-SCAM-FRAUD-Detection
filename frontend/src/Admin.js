import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://ai-based-scam-fraud-detection.onrender.com/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (Array.isArray(result)) {
        setData(result);
      } else if (Array.isArray(result.data)) {
        setData(result.data);
      } else {
        setData([]);
      }

    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  // 🔥 CALCULATIONS
  const total = data.length;
  const scamCount = data.filter(item => item.result === "Scam").length;
  const safeCount = data.filter(item => item.result === "Safe").length;

  const chartData = [
    { name: "Scam", value: scamCount },
    { name: "Safe", value: safeCount }
  ];

  const COLORS = ["#ff4d4d", "#39ff14"];

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛠 Admin Panel</h1>

      {/* 🔥 STATS */}
      <div style={{ marginBottom: "20px" }}>
        <p><b>Total Messages:</b> {total}</p>
        <p><b>Scam:</b> {scamCount}</p>
        <p><b>Safe:</b> {safeCount}</p>
      </div>

      {/* 🔥 CHART */}
      <div style={{ marginBottom: "30px" }}>
        <h3>📊 Scam Analysis</h3>

        {total > 0 && (
          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>

      {/* 🔥 DATA LIST */}
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        data.map((item, index) => (
          <div key={index} className="chat bot">
            <p><b>Message:</b> {item.message}</p>
            <p><b>Result:</b> {item.result}</p>
            <p><b>Probability:</b> {item.probability}%</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;