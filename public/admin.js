async function loadData() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please login first.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3600/admin/scams", {
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) throw new Error("Failed to fetch scam reports");

    const data = await res.json();
    let html = "";

    data.forEach(item => {
      html += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px;">
          <p><b>Message:</b> ${item.message}</p>
          <p><b>Result:</b> ${item.result}</p>
          <p><b>Date:</b> ${new Date(item.date).toLocaleString()}</p>
          <button onclick="deleteItem('${item._id}')">Delete</button>
        </div>
      `;
    });

    document.getElementById("data").innerHTML = html;
  } catch (err) {
    console.error(err);
    document.getElementById("data").innerHTML = `<p style="color:red;">Error loading data.</p>`;
  }
}

async function deleteItem(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please login first.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3600/admin/scams/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) throw new Error("Failed to delete scam report");

    loadData();
  } catch (err) {
    console.error(err);
    alert("Error deleting scam report.");
  }
}