import axios from "axios";
import { API_BASE_URL } from "./config";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends/receives the httpOnly JWT cookie
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
