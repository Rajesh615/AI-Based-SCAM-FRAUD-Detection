import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-based-scam-fraud-detection.onrender.com",
  timeout: 60000
});

export default API;