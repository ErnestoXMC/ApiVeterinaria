import generarJWT from "../helpers/generarJWT.js";
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

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //? Verificar si existe el usuario
    const usuario = await Veterinario.findOne({ email });

    if (!usuario) {
        const error = new Error("El Usuario No Existe");
        res.status(401).json({ msg: error.message });
    }

    //? Verificar si el usuario está confirmado(Verificado)
    const { confirmado } = usuario;

    if (!confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        res.status(403).json({ msg: error.message });
    }

    //? Verificar Contraseñas
    const passwordVerificado = await usuario.comprobarPassword(password);
    if (!passwordVerificado) {
        const error = new Error("Password incorrecto");
        res.status(406).json({ msg: error.message });
    }

    //? Generar Token unico
    res.json({
        token: generarJWT(usuario.id)
    });

}

const perfil = (req, res) => {
    console.log(req.veterinario);
    res.json({ msg: `Mostrando Perfil Veterinario`, veterinario: req.veterinario });
}

export { registrar, perfil, confirmar, autenticar };
