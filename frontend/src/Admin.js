import React, { useEffect, useState } from "react";

function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ FIXED URL
      const res = await fetch("https://ai-based-scam-fraud-detection.onrender.com/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      console.log("ADMIN DATA:", result);

      // ✅ Safe array handling
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛠 Admin Panel</h1>

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