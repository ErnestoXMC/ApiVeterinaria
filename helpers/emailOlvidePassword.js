import nodemailer from "nodemailer";

const emailOlvidePassword = async (datosCuenta) => {

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
        subject: "Actualiza tu Password en APV",
        text: "Actualiza tu Password en APV Text",
        html: `
            <p>Hola ${nombre}, actualiza tu password en APV</p>
            <p>
                Sigue al siguiente enlace para actualizar tu password <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Actualizar Password</a>
            </p>
            <p>Si tu no creaste esta cuenta, puedes ignorarla</p>
        `
    })

    console.log("Mensaje enviado: %s", info.messageId);

}

export default emailOlvidePassword;
