import api from "../api/axios";

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    // Elegant fallback image
    return "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80";
  }

  // If it's already a full URL (like Unsplash), use it directly
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Construct the full URL using the axios baseURL
  // Removes '/api' from the end of the baseURL to get the root server URL
  const baseUrl = api.defaults.baseURL?.replace(/\/api$/, "") || "";
  return `${baseUrl}${imagePath}`;
};
