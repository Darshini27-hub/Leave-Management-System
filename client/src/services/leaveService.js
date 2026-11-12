import api from "./api";

export const applyLeave = (data) => api.post("/leaves", data);
export const getMyLeaves = (params) => api.get("/leaves/my", { params });
export const cancelLeave = (id) => api.patch("/leaves/" + id + "/cancel");
export const getTeamLeaves = (params) => api.get("/leaves/team", { params });
export const getAllLeaves = (params) => api.get("/leaves", { params });
export const reviewLeave = (id, data) => api.patch("/leaves/" + id + "/review", data);
export const getBalance = () => api.get("/leaves/balance");