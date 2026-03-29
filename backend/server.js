require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const Scam = require("./models/Scam");

const app = express();

// ✅ MIDDLEWARE
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// ✅ ROUTES
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("🚀 AI Scam Detector Backend Running");
});

// ✅ CHECK API
app.post("/api/check", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const scriptPath = path.join(__dirname, "ml", "predict.py");

    exec(
      `python3 "${scriptPath}" "${message.replace(/"/g, '\\"')}"`,
      async (err, stdout, stderr) => {

        if (err) {
          console.log("❌ Python Error:", stderr);
          return res.status(500).json({ message: "ML error" });
        }

        try {
          const result = JSON.parse(stdout);

          const probability = Math.round(result.probability);
          const prediction = result.prediction === 1 ? "Scam" : "Safe";

          // ✅ save to DB
          await Scam.create({
            message,
            result: prediction,
            probability: probability
          });

          // ✅ send response
          res.json({
            probability: probability,
            result: prediction,
            keywords: result.keywords || [],
            explanation: result.explanation || []
          });

        } catch (parseError) {
          console.log("❌ JSON Parse Error:", parseError);
          return res.status(500).json({ message: "Invalid ML output" });
        }
      }
    );

  } catch (error) {
    console.log("❌ Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADMIN API
app.get("/api/admin", async (req, res) => {
  try {
    const data = await Scam.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.log("❌ Admin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

// ✅ SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});