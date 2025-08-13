import { Router } from 'express';
import { getInvitadosPorEvento, crearInvitacionesLote,enviarCorreoDePrueba } from "../controllers/invitado.controller.js";

const router = Router();

// Obtener invitados de un evento
router.get('/:id_evento', getInvitadosPorEvento);

// Crear invitaciones en lote
router.post('/lote', crearInvitacionesLote);


router.post('/enviar-correo-prueba', enviarCorreoDePrueba);

export default router;
