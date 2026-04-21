import api from "./axios";

export const getAllRooms = async (params) => {
  const response = await api.get("/rooms", { params });
  return response.data;
};

export const getFeaturedRooms = async () => {
  const response = await api.get("/rooms/featured");
  return response.data;
};

export const getRoomById = async (id) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

// Admin actions — now supports FormData for image uploads
export const createRoom = async (roomData) => {
  const isFormData = roomData instanceof FormData;
  const response = await api.post("/rooms", roomData, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const updateRoom = async (id, roomData) => {
  const isFormData = roomData instanceof FormData;
  const response = await api.put(`/rooms/${id}`, roomData, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};

export const toggleAvailability = async (id) => {
  const response = await api.patch(`/rooms/${id}/availability`);
  return response.data;
};