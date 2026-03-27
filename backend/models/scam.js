const mongoose = require("mongoose");

const ScamSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    message: {
      type: String,
      required: true
    },
    result: {
      type: String
    },
    probability: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scam", ScamSchema);