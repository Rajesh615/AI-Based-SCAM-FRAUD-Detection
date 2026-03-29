const express = require("express");
const router = express.Router();
const Scam = require("../models/Scam");

// ✅ GET ALL DATA
router.get("/stats", async (req, res) => {
  try {
    const data = await Scam.find().sort({ createdAt: -1 });

    const total = data.length;
    const scam = data.filter(d => d.result === "Scam").length;
    const safe = data.filter(d => d.result === "Safe").length;

    res.json({
      total,
      scam,
      safe,
      data
    });

  } catch (err) {
    console.log("Admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;