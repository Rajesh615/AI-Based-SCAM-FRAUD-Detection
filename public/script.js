document.getElementById("fraudForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = document.getElementById("message").value.trim();

  if (!message) {
    alert("Please enter a message");
    return;
  }

  // 🔄 Loading UI
  document.getElementById("result").innerHTML = `
    <p class="loading">🔍 Analyzing message...</p>
  `;

  try {
    const [ruleRes, aiRes, explainRes] = await Promise.all([
      fetch("/check-scam", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ message })
      }),
      fetch("/detect-scam-ml", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ message })
      }),
      fetch("/explain-scam", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ message })
      })
    ]);

    const ruleData = await ruleRes.json();
    const aiData = await aiRes.json();
    const explainData = await explainRes.json();

    // 📊 Probability
    let probability = ruleData.probability || 0;

    // 🎯 Risk Level
    let risk = "Safe ✅";
    let color = "green";

    if (probability > 60) {
      risk = "High Risk 🚨";
      color = "red";
    } else if (probability > 30) {
      risk = "Medium Risk ⚠️";
      color = "orange";
    }

    // 💾 Save history
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.unshift({
      message,
      result: aiData.result,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("history", JSON.stringify(history));

    // 🎨 UI Output
    document.getElementById("result").innerHTML = `
      <h2 style="color:${color}">
        Scam Probability: ${probability}%
      </h2>

      <!-- Progress Bar -->
      <div style="background:#eee; height:20px; border-radius:10px; overflow:hidden; margin-bottom:10px;">
        <div style="
          width:${probability}%;
          background:${color};
          height:100%;
          color:white;
          font-weight:bold;
        ">
          ${probability}%
        </div>
      </div>

      <h3 style="color:${color}">
        ${risk}
      </h3>

      <hr>

      <h3>🤖 AI Result: ${aiData.result} (${aiData.confidence})</h3>

      <h3>🧠 Why this is scam?</h3>
      <p style="text-align:left; line-height:1.6;">
        ${explainData.explanation}
      </p>

      <hr>

      <button onclick="showHistory()">📜 View History</button>
      <div id="history"></div>
    `;

  } catch (err) {
    console.error(err);
    document.getElementById("result").innerHTML = `
      <p style="color:red; font-size:18px;">
        ❌ Error connecting to server
      </p>
    `;
  }
});


/* ================= HISTORY VIEW ================= */
function showHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (history.length === 0) {
    document.getElementById("history").innerHTML = "<p>No history yet</p>";
    return;
  }

  let html = "<h3>📜 History</h3>";

  history.forEach(item => {
    html += `
      <div style="
        border:1px solid #ccc;
        margin:10px;
        padding:10px;
        border-radius:8px;
        background:#fafafa;
      ">
        <p><b>Message:</b> ${item.message}</p>
        <p><b>Result:</b> ${item.result}</p>
        <small>${item.date}</small>
      </div>
    `;
  });

  document.getElementById("history").innerHTML = html;
}