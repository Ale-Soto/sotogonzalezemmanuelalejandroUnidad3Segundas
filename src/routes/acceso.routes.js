import { Router } from 'express';
import { marcarAsistencia } from '../controllers/acceso.controller.js';

const router = Router();

router.post('/', marcarAsistencia);

export default router;
