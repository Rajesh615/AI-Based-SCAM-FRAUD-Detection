require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Scam = require("./models/Scam");


const app = express();

// ✅ MIDDLEWARE
app.use(cors({
  origin: "http://localhost:3000",
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
const { exec } = require("child_process");
const path = require("path");

app.post("/api/check", async (req, res) => {
  try {
    const { message } = req.body;

    const scriptPath = path.join(__dirname, "ml", "predict.py");

    exec(`python "${scriptPath}" "${message.replace(/"/g, '\\"')}"`, async (err, stdout, stderr) => {
      if (err) {
        console.log("❌ Python Error:", stderr);
        return res.status(500).json({ message: "ML error" });
      }

      const result = JSON.parse(stdout);

      // save to DB
      const newScam = await Scam.create({
        message,
        result: result.result,
        probability: result.probability,
      });

      res.json({
        message,
        ...result
      });
    });

  } catch (error) {
    console.log(error);
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