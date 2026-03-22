import { useEffect, useState } from "react";

function Admin() {
  const [scams, setScams] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("http://localhost:3600/admin/scams", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setScams(data);

    } catch {
      alert("Error loading data");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ padding:"20px" }}>
      <h2>📊 Admin Dashboard</h2>

      <button onClick={logout}>Logout</button>

      <table style={{
        width:"100%",
        borderCollapse:"collapse",
        marginTop:"20px"
      }}>
        <thead>
          <tr>
            <th style={{background:"#0072ff", color:"white", padding:"10px"}}>
              Message
            </th>
            <th style={{background:"#0072ff", color:"white", padding:"10px"}}>
              Result
            </th>
            <th style={{background:"#0072ff", color:"white", padding:"10px"}}>
              Date
            </th>
          </tr>
        </thead>

        <tbody>
          {scams.map((s, i) => (
            <tr key={i}>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>
                {s.message}
              </td>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>
                {s.result}
              </td>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>
                {new Date(s.date).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;