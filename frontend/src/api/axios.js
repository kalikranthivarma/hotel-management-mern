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

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = JSON.parse(localStorage.getItem("hotelAuth"));

      if (auth && auth.refreshToken) {
        try {
          const res = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken: auth.refreshToken,
          });

          if (res.data.success) {
            // Update auth data in localStorage
            auth.token = res.data.token;
            auth.refreshToken = res.data.refreshToken;
            localStorage.setItem("hotelAuth", JSON.stringify(auth));

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${auth.token}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, clear storage (forces user to log in again)
          localStorage.removeItem("hotelAuth");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
