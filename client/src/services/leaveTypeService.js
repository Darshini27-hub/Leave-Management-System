import api from "./api";

export const getLeaveTypes = (params) => api.get("/leave-types", { params });
export const createLeaveType = (data) => api.post("/leave-types", data);
export const updateLeaveType = (id, data) => api.put("/leave-types/" + id, data);
export const updateLeaveTypeStatus = (id, isActive) => api.patch("/leave-types/" + id + "/status", { isActive });