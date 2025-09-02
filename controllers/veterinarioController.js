import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistro from "../helpers/emailRegistro.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    //?Verificamos que el usuario no se repita
    const existeUsuario = await Veterinario.findOne({ email: email });// Primero el campo de la coleccion y luego el campo del request

    if (existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    }

    //?Insertamos el veterinario
    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //?Envio de email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado);

    } catch (error) {
        res.status(400).json({ msg: `Error al registrar un usuario` });
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
        return res.status(401).json({ msg: error.message });
    }

    //? Verificar si el usuario está confirmado(Verificado)
    const { confirmado } = usuario;

    if (!confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    //? Verificar Contraseñas
    const passwordVerificado = await usuario.comprobarPassword(password);
    if (!passwordVerificado) {
        const error = new Error("Password incorrecto");
        return res.status(406).json({ msg: error.message });
    }

    //? Generar Token unico
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        web: usuario.web,
        token: generarJWT(usuario.id)
    });

}

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
}

const olvidarPassword = async (req, res) => {
    const { email } = req.body;

    //? Verificamos la existencia del veterinario
    const existeVeterinario = await Veterinario.findOne({ email });

    if (!existeVeterinario) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    //? Generamos un nuevo token y lo almacenamos en nuestra bd
    try {
        existeVeterinario.token = generarId();

        await existeVeterinario.save();

        //? Enviamos Email
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        return res.json({ msg: "Hemos enviado un correo a tu email con las instrucciones" });

    } catch (error) {
        return res.status(400).json({ msg: `Error al almacenar el nuevo token` });
    }

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        return res.json({ msg: "Token válido y el usuario existe" });
    } else {
        const error = new Error("Token no válido");
        return res.status(400).json({ msg: error.message });
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error("Usuario no encontrado");
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();
        return res.json({ msg: "Password actualizado correctamente" });

    } catch (error) {
        return res.status(400).json({ msg: "Error al actualizar tu password" });
    }
}

const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);

    if (!veterinario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    const { email } = req.body;

    if (veterinario.email !== email) {
        const existeEmail = await Veterinario.findOne({ email });
        if (existeEmail) {
            const error = new Error("Este email ya ha sido registrado");
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.telefono = req.body.telefono || veterinario.telefono;
        veterinario.web = req.body.web || veterinario.web;

        await veterinario.save();
        return res.json(veterinario);
    } catch (error) {
        return res.status(400).json({ msg: "Error al actualizar al usuario" });
    }
}

const actualizarPassword = async (req, res) => {

    const {id} = req.veterinario;
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
        const error = new Error("Error al obtener el veterinario");
        return res.status(404).json({ msg: error.message });
    }
    
    //? Obtenemos las contraseñas del body
    const {pwd_actual, pwd_nuevo} = req.body;

    //? Verificar Contraseñas
    const passwordVerificado = await veterinario.comprobarPassword(pwd_actual);
    if (!passwordVerificado) {
        const error = new Error("El Password Actual Ingresado es Incorrecto");
        return res.status(406).json({ msg: error.message });
    }

    //? Actualizamos nuestra contraseña y guardamos los datos
    try {
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        return res.json({msg: "Password Actualizado Correctamente"});
    } catch (error) {
        return res.status(400).json({msg: "Error al Actualizar Password"});
    }

}
export { registrar, perfil, confirmar, autenticar, olvidarPassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword };
