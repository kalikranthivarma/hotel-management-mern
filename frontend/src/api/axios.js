import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    "[axios] VITE_API_BASE_URL is not set. Falling back to localhost. " +
    "Make sure to set this env variable in Render for production builds."
  );
}

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("hotelAuth"));
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default instance;
