import api from "./axios";

export const getMenuItems = async (params) => {
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

export const getDiningTables = async () => {
  const response = await api.get("/dining/tables");
  return response.data;
};

export const createDiningOrder = async (orderData) => {
  const response = await api.post("/dining/order", orderData);
  return response.data;
};

export const getMyDiningOrders = async () => {
  const response = await api.get("/dining/my-orders");
  return response.data;
};

export const getAllDiningOrders = async () => {
  const response = await api.get("/dining/orders");
  return response.data;
};

export const updateDiningOrderStatus = async (id, orderData) => {
  const response = await api.put(`/dining/order/${id}`, orderData);
  return response.data;
};

export const bookDiningTable = async (reservationData) => {
  const response = await api.post("/dining/book-table", reservationData);
  return response.data;
};
