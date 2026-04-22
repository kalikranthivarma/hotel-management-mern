import api from "./axios";

export const createContactMessage = async (contactData) => {
  const response = await api.post("/contact", contactData);
  return response.data;
};

export const getContactMessages = async () => {
  const response = await api.get("/contact");
  return response.data;
};

export const replyToContactMessage = async (id, replyData) => {
  const response = await api.post(`/contact/${id}/reply`, replyData);
  return response.data;
};
