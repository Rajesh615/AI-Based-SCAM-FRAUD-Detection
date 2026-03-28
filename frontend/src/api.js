import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-based-scam-fraud-detection.onrender.com"
});

export default API;