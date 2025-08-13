import axios from "axios";

const API = "http://localhost:4000/eventos";

export const getEvents = async () => axios.get(API);
export const getEventById = async (id) => axios.get(`${API}/${id}`);
export const createEvent = async (evento) => axios.post(API, evento);
export const updateEvent = async (id, evento) => axios.put(`${API}/${id}`, evento);
export const deleteEvent = async (id) => axios.delete(`${API}/${id}`);
