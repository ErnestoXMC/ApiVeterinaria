import express from "express";//Dependencias no requerien la extension .js
import dotenv from "dotenv";
import conectarDB from "./config/db.js";//Archivos creados por nosotros necesitan la extension .js
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();
//Permite leer correctamente los datos JSON que nos mandan en request en el controlador
app.use(express.json());
//Obtendremos las variables de entorno
dotenv.config();

//Conexion a la BD
conectarDB();

//Ruta
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

//Puerto
const PORT = process.env.PORT || 4000;

//Puerto para correr el sistema
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});











