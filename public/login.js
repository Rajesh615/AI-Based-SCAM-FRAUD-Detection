document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("http://localhost:3600/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      document.getElementById("status").innerText = "✅ Login successful!";
      // Redirect to admin dashboard
      window.location.href = "admin.html";
    } else {
      document.getElementById("status").innerText = "❌ Login failed: " + (data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Error connecting to server.";
  }
});