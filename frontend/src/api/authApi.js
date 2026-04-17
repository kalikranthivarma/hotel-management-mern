import axios from "./axios";

// USER AUTH APIs

export const registerUserStep1 = (data) =>
  axios.post("/auth/user/register-step-1", data);

export const verifyUserOTP = (data) =>
  axios.post("/auth/user/verify-otp", data);

export const registerUserStep3 = (data) =>
  axios.post("/auth/user/register-step-3", data);

export const loginUser = (data) =>
  axios.post("/auth/user/login", data);

export const forgotPassword = (data) =>
  axios.post("/auth/user/forgot-password", data);

export const resetPassword = (data) =>
  axios.post("/auth/user/reset-password", data); // Changed to post with OTP logic


// ADMIN AUTH APIs

export const registerAdminStep1 = (data) =>
  axios.post("/auth/admin/register-step-1", data);

export const verifyAdminOTP = (data) =>
  axios.post("/auth/admin/verify-otp", data);

export const registerAdminStep3 = (data) =>
  axios.post("/auth/admin/register-step-3", data);

export const loginAdmin = (data) =>
  axios.post("/auth/admin/login", data);

export const forgotAdminPassword = (data) =>
  axios.post("/auth/admin/forgot-password", data);

export const resetAdminPassword = (data) =>
  axios.post("/auth/admin/reset-password", data);
