import axios from "axios";
const API = "http://localhost:4000/invitados";

// Crear invitaciones masivas
export const crearInvitaciones = async (id_evento, id_estudiantes) =>
  axios.post(`${API}/lote`, { id_evento, id_estudiantes });
