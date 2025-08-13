import axios from "axios";
const API = "http://localhost:4000/estudiantes"; // Usa la IP si pruebas en red local

export const getEstudiantes = async () => axios.get(API);
export const createEstudiante = async (estudiante) => axios.post(API, estudiante);
export const getEstudiantesNoInvitados = (id_evento) => axios.get(`${API}/no-invitados/${id_evento}`);
