import express from 'express';
import { registrar, perfil, confirmar, autenticar, olvidarPassword, comprobarToken, nuevoPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//! Rutas Publicas
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidarPassword);
router.route('/olvide-password/:token')
        .get(comprobarToken)
        .post(nuevoPassword);

//! Rutas Protegidas
router.get('/perfil', checkAuth, perfil);



export default router;