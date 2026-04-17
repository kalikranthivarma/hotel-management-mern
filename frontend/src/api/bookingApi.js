import api from "./axios";

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const updateBookingStatus = async (id, statusData) => {
  const response = await api.put(`/bookings/${id}`, statusData);
  return response.data;
};
