import { Router } from 'express';
import { getEstudiantes, createEstudiante, getEstudiantesNoInvitados } from "../controllers/estudiante.controller.js";

const router = Router();

// Listar todos los estudiantes
router.get('/', getEstudiantes);
router.post('/', createEstudiante);
router.get('/no-invitados/:id_evento', getEstudiantesNoInvitados);

export default router;
