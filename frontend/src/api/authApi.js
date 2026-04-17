import axios from "./axios";

// USER AUTH APIs

export const registerUser = (data) =>
  axios.post("/auth/user/register", data);

export const registerAdmin = (data) =>
  axios.post("/auth/admin/register", data);

export const loginUser = (data) =>
  axios.post("/auth/user/login", data);

export const loginAdmin = (data) =>
  axios.post("/auth/admin/login", data);

export const verifyEmail = (token, role = "user") =>
  axios.get(`/auth/${role}/verify-email/${token}`);

export const resendVerification = (data) =>
  axios.post("/auth/user/resend-verification", data);

export const forgotPassword = (data, role = "user") =>
  axios.post(`/auth/${role}/forgot-password`, data);

export const resetPassword = (token, data, role = "user") =>
  axios.put(`/auth/${role}/reset-password/${token}`, data);
