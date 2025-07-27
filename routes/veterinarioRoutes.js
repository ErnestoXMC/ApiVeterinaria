import express from 'express';
import { registrar, perfil, confirmar, autenticar } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//! Rutas Publicas
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);

//! Rutas Protegidas
router.get('/perfil', checkAuth, perfil);


export default router;