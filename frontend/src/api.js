import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000"
});

export const checkMessage = (message) => {
  return API.post("/api/check", { message });
};

export default API;