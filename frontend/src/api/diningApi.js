import api from "./axios";

export const getDiningTables = async () => {
  const response = await api.get("/dining/tables");
  return response.data;
};

export const createDiningTable = async (tableData) => {
  const response = await api.post("/dining/tables", tableData);
  return response.data;
};

export const updateDiningTable = async (id, tableData) => {
  const response = await api.put(`/dining/tables/${id}`, tableData);
  return response.data;
};

export const deleteDiningTable = async (id) => {
  const response = await api.delete(`/dining/tables/${id}`);
  return response.data;
};

export const createDiningOrder = async (orderData) => {
  const response = await api.post("/dining/order", orderData);
  return response.data;
};

export const cancelDiningOrder = async (id) => {
  const response = await api.put(`/dining/order/${id}/cancel`);
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

export const getMyDiningReservations = async () => {
  const response = await api.get("/dining/my-reservations");
  return response.data;
};

export const getAllDiningReservations = async () => {
  const response = await api.get("/dining/reservations");
  return response.data;
};

export const updateDiningReservationStatus = async (id, reservationData) => {
  const response = await api.put(`/dining/reservation/${id}`, reservationData);
  return response.data;
};
