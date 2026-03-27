const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 GENERATE TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =========================
// ✅ SIGNUP
// =========================
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
    });

    res.status(201).json({
      message: "Signup successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("❌ Signup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// ✅ LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ SAFE PASSWORD CHECK (NO CRASH)
    let isMatch = false;

    if (typeof user.matchPassword === "function") {
      isMatch = await user.matchPassword(password);
    } else {
      // fallback (plain text)
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("❌ Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// ✅ GET USER
// =========================
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;