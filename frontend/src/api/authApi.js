import axios from "./axios";

// USER AUTH APIs

export const registerUser = (data) =>
  axios.post("/auth/user/register", data);

export const loginUser = (data) =>
  axios.post("/auth/user/login", data);

export const verifyEmail = (token) =>
  axios.get(`/auth/user/verify-email/${token}`);

export const forgotPassword = (data) =>
  axios.post("/auth/user/forgot-password", data);

export const resetPassword = (token, data) =>
  axios.put(`/auth/user/reset-password/${token}`, data);
