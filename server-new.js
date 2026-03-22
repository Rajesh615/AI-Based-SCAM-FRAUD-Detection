const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

/* ================= DEBUG ================= */
console.log("🔑 OPENAI KEY:", process.env.OPENAI_API_KEY);

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================= HOME ================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= DB ================= */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB ERROR:", err));

/* ================= MODELS ================= */
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String
}));

const Scam = mongoose.model("Scam", new mongoose.Schema({
  message: String,
  result: String,
  date: { type: Date, default: Date.now }
}));

/* ================= OPENAI ================= */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ================= AUTH ================= */
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

/* ================= CREATE ADMIN ================= */
app.get("/create-admin", async (req, res) => {
  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    email: "admin@gmail.com",
    password: hashed
  });

  res.send("✅ Admin created");
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

/* ================= RULE ================= */
app.post("/check-scam", (req, res) => {
  const { message } = req.body;

  const words = ["lottery", "urgent", "otp", "bank", "click"];
  let score = 0;
  let found = [];

  words.forEach(word => {
    if (message.toLowerCase().includes(word)) {
      score += 20;
      found.push(word);
    }
  });

  res.json({ probability: score, suspicious: found });
});

/* ================= ML ================= */
app.post("/detect-scam-ml", async (req, res) => {
  try {
    // TEMP FAKE ML RESPONSE
    const text = req.body.message.toLowerCase();

    let result = "Safe";
    let confidence = "40%";

    if (text.includes("lottery") || text.includes("click")) {
      result = "Scam";
      confidence = "70%";
    }

    await Scam.create({
      message: req.body.message,
      result
    });

    res.json({ result, confidence });

  } catch (err) {
    res.json({ result: "Error", confidence: "0%" });
  }
});

/* ================= AI EXPLANATION ================= */
app.post("/explain-scam", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Explain scam message simply." },
        { role: "user", content: message }
      ]
    });

    return res.json({
      explanation: response.choices[0].message.content
    });

  } catch (err) {
    console.log("⚠️ OpenAI failed, using fallback");

    let explanation = [];

    if (message.includes("lottery"))
      explanation.push("• Lottery scams are very common");

    if (message.includes("click"))
      explanation.push("• Urgent link clicking is risky");

    if (message.includes("urgent"))
      explanation.push("• Urgency is used to manipulate users");

    if (explanation.length === 0)
      explanation.push("• Could be safe but stay cautious");

    return res.json({
      explanation: explanation.join("<br>")
    });
  }
});

/* ================= ADMIN ================= */
app.get("/admin/scams", auth, async (req, res) => {
  const data = await Scam.find().sort({ date: -1 });
  res.json(data);
});

/* ================= START ================= */
const PORT = process.env.PORT || 3600;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});