import axios from "./axios";

// USER AUTH APIs

export const registerUserStep1 = (data) =>
  axios.post("/auth/user/register-step-1", data);

export const verifyUserOTP = (data) =>
  axios.post("/auth/user/verify-otp", data);

export const registerUserStep3 = (data) =>
  axios.post("/auth/user/register-step-3", data);

export const registerUser = (data) =>
  axios.post("/auth/user/register", data);

export const loginUser = (data) =>
  axios.post("/auth/user/login", data);

// ADMIN AUTH APIs

export const registerAdminStep1 = (data) =>
  axios.post("/auth/admin/register-step-1", data);

export const verifyAdminOTP = (data) =>
  axios.post("/auth/admin/verify-otp", data);

export const registerAdminStep3 = (data) =>
  axios.post("/auth/admin/register-step-3", data);

export const registerAdmin = (data) =>
  axios.post("/auth/admin/register", data);

export const loginAdmin = (data) =>
  axios.post("/auth/admin/login", data);

export const verifyEmail = (token, role = "user") =>
  axios.get(`/auth/${role}/verify-email/${token}`);

export const resendVerification = (data) =>
  axios.post("/auth/user/resend-verification", data);

export const forgotPassword = (data, role = "user") =>
  axios.post(`/auth/${role}/forgot-password`, data);

export const resetPassword = (data, role = "user") =>
  axios.post(`/auth/${role}/reset-password`, data);