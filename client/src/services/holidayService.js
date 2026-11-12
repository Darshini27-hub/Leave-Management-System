import api from "./api";

export const getHolidays = (params) => api.get("/holidays", { params });
export const addHoliday = (data) => api.post("/holidays", data);
export const deleteHoliday = (id) => api.delete("/holidays/" + id);