import axios from "./axios";

// USER AUTH APIs

export const registerUser = (data) =>
  axios.post("/user/register", data);

export const loginUser = (data) =>
  axios.post("/user/login", data);

export const verifyEmail = (token) =>
  axios.get(`/user/verify-email/${token}`);

export const forgotPassword = (data) =>
  axios.post("/user/forgot-password", data);

export const resetPassword = (token, data) =>
  axios.put(`/user/reset-password/${token}`, data);