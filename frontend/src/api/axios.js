import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

instance.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("hotelAuth"));
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default instance;
