import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-based-scam-fraud-detection.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;