import Veterinario from "../models/Veterinario.js";

const registrar = async (req, res) => {
    const { email } = req.body;

    //Verificamos que el usuario no se repita
    const existeUsuario = await Veterinario.findOne({ email: email });// Primero el campo de la coleccion y luego el campo del request

    if (existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    }

    //Insertamos el veterinario
    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        res.json(veterinarioGuardado);

    } catch (error) {
        res.status(400).json({ msg: `Error al registrar un usuario: ${error.message}` });
    }
}

const perfil = (req, res) => {
    res.json({ msg: "Desde API/VETERINARIOS/perfil" });
}

const confirmar = async (req, res) => {

    const { token } = req.params;

    const usuarioConfirmado = await Veterinario.findOne({ token });//Object literal

    if (!usuarioConfirmado) {
        const error = new Error('Token No Válido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmado.token = null;
        usuarioConfirmado.confirmado = true;
        await usuarioConfirmado.save();
        
        res.json({ msg: "Usuario Confirmado Correctamente" });
    } catch (error) {
        res.status(400).json({ msg: "Error al confirmar usuario" });
    }
}

export { registrar, perfil, confirmar };
