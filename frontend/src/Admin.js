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
      const res = await fetch(
        "https://ai-based-scam-fraud-detection.onrender.com/api/admin/stats"
      );

      const result = await res.json();

      // ✅ correct handling
      setData(result.data || []);
      setStats({
        total: result.total || 0,
        scam: result.scam || 0,
        safe: result.safe || 0
      });

    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  const chartData = [
    { name: "Scam", value: stats.scam },
    { name: "Safe", value: stats.safe }
  ];

  const COLORS = ["#ff4d4d", "#39ff14"];

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛠 Admin Panel</h1>

      {/* ✅ STATS */}
      <div style={{ marginBottom: "20px" }}>
        <p><b>Total Messages:</b> {stats.total}</p>
        <p><b>Scam:</b> {stats.scam}</p>
        <p><b>Safe:</b> {stats.safe}</p>
      </div>

      {/* ✅ CHART */}
      <div style={{ marginBottom: "30px" }}>
        <h3>📊 Scam Analysis</h3>

        {stats.total > 0 && (
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

      {/* ✅ DATA LIST */}
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