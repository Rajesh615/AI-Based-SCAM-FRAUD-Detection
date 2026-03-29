require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { spawn } = require("child_process");
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
  console.log("API HIT");
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }


    // ✅ USE FULL PATH (IMPORTANT FIX)
    const scriptPath = path.join(__dirname, "ml", "predict.py");

    console.log("Running python from:", scriptPath);

     const py = spawn("python", [scriptPath, message]);

    let data = "";

    py.stdout.on("data", (chunk) => {
      console,log("PYTHON OUTPUT:",chunk.toString());
      data+= chunk.tostring();
    });

    py.stderr.on("data", (err) => {
      console.log("❌ Python Error:", err.toString());
    });

    py.on("close", async () => {
      try {
        const result = JSON.parse(data);

        const probability = Math.round(result.probability);

        // ✅ YOUR UI-BASED LOGIC (GOOD 👍)
        let prediction;
        if (probability > 60) {
          prediction = "Scam";
        } else if (probability > 40) {
          prediction = "Suspicious";
        } else {
          prediction = "Safe";
        }

        await Scam.create({
          message,
          result: prediction,
          probability
        });

        res.json({
          probability,
          result: prediction,
          keywords: result.keywords || [],
          explanation: result.explanation || []
        });

      } catch (err) {
        console.log("❌ Parse Error:", err);
        res.status(500).json({ message: "ML parse error" });
      }
    });

  } catch (err) {
    console.log("❌ Server Error:", err);
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