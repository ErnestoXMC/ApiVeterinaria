import jwt from 'jsonwebtoken';

//* No mandar informacion sensible, solo mandamos el id del usuario
const generarJWT = (id) => {
    return jwt.sign(
        {id}, 
        process.env.JWT_SECRET, 
        {expiresIn: "30d"}
    );
}

export default generarJWT;