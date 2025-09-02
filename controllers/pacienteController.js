import Paciente from "../models/Paciente.js"

const obtenerPacientes = async (req, res) => {

    try {
        //? Por defecto compara el _id de req.veterinario
        const pacientes = await Paciente.find()
            .where("veterinario")
            .equals(req.veterinario);
        return res.json(pacientes);
    } catch (error) {
        return res.status(400).json({ msg: "Error al obtener los pacientes del veterinario" })
    }

}

const agregarPaciente = async (req, res) => {

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteAlmacenado = await paciente.save();
        return res.json(pacienteAlmacenado);

    } catch (error) {
        return res.status(400).json({ msg: "Error al agregar un paciente" });
    }

}

const obtenerPacienteById = async (req, res) => {

    try {
        const { id } = req.params;

        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: "Paciente No Encontrado" });
        }

        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            const error = new Error("Error, no puedes acceder a este paciente");
            return res.status(400).json({ msg: error.message });
        }

        return res.json(paciente);
    } catch (error) {
        return res.status(400).json({ msg: "Error al obtener un paciente" });
    }


}

const actualizarPaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: "Paciente No Encontrado" });
        }

        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            const error = new Error("Error, no puedes acceder a este paciente");
            return res.status(403).json({ msg: error.message })
        }

        //? Obtenemos la info del body y lo asignamos al objeto
        const { nombre, propietario, email, fecha, sintomas } = req.body;

        paciente.nombre = nombre || paciente.nombre;
        paciente.propietario = propietario || paciente.propietario;
        paciente.email = email || paciente.email;
        paciente.fecha = fecha || paciente.fecha;
        paciente.sintomas = sintomas || paciente.sintomas;

        const pacienteActualizado = await paciente.save();

        return res.json(pacienteActualizado);

    } catch (error) {
        return res.status(400).json({ msg: "Error al actualizar un paciente" });
    }
}

const eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: "Paciente No Encontrado" });
        }

        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            const error = new Error("Error, no puedes acceder a este paciente");
            return res.status(403).json({ msg: error.message })
        }

        await paciente.deleteOne();
        return res.json({msg: "Paciente Eliminado correctamente"});
    } catch (error) {
        return res.status(400).json({msg: "Error al eliminar un paciente"});
    }
}

export { obtenerPacientes, agregarPaciente, obtenerPacienteById, actualizarPaciente, eliminarPaciente }