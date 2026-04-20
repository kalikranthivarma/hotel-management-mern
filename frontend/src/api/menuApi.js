import api from "./axios";

export const getMenuItems = async (params = {}) => {
  const response = await api.get("/menu", { params });
  return response.data;
};

export const createMenuItem = async (menuData) => {
  const response = await api.post("/menu", menuData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateMenuItem = async (id, menuData) => {
  const response = await api.put(`/menu/${id}`, menuData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};
