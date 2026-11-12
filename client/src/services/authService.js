import api from "./api";

export const loginUser = (email, password) => api.post("/auth/login", { email, password });
export const getMe = () => api.get("/auth/me");
export const changePassword = (oldPassword, newPassword) => api.put("/auth/change-password", { oldPassword, newPassword });