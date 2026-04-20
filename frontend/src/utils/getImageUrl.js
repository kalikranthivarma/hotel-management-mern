import api from "../api/axios";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80";
  if (imagePath.startsWith("http")) return imagePath;
  
  // Example: api.defaults.baseURL is "http://127.0.0.1:5000/api"
  // If the path is "/api/rooms/image/...", we want the final URL to be:
  // "http://127.0.0.1:5000" + "/api/rooms/image/..."
  const baseUrl = api.defaults.baseURL?.replace(/\/api$/, "") || "http://127.0.0.1:5000";
  return `${baseUrl}${imagePath}`;
};
