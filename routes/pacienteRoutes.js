import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { actualizarPaciente, agregarPaciente, eliminarPaciente, obtenerPacienteById, obtenerPacientes } from "../controllers/pacienteController.js";

const router = express.Router();

//! Rutas Protegidas
router.route('/')
        .get(checkAuth, obtenerPacientes)
        .post(checkAuth, agregarPaciente);

router.route('/:id')
        .get(checkAuth, obtenerPacienteById)
        .put(checkAuth, actualizarPaciente)
        .delete(checkAuth, eliminarPaciente);

export default router;

