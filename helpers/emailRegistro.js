import nodemailer from "nodemailer";

const emailRegistro = async (datosCuenta) => {

    //*Configuracion email
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //*Envio de email
    const {email, nombre, token} = datosCuenta;

    const info = await transporter.sendMail({
        from: "apv@gmailcom",
        to: email,
        subject: "Confirma tu cuenta en APV",
        text: "Confirma tu cuenta en APV Text",
        html: `
            <p>Hola ${nombre}, confirma tu cuenta en APV</p>
            <p>
                Tu cuenta ya esta casi lista, solo debes confirmarla dandole click al siguiente enlace <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
            </p>
            <p>Si tu no creaste esta cuenta, puedes ignorarla</p>
        `
    })

    console.log("Mensaje enviado: %s", info.messageId);

}

export default emailRegistro;
