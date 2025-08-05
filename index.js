import express from "express";//Dependencias no requerien la extension .js
import dotenv from "dotenv";
import conectarDB from "./config/db.js";//Archivos creados por nosotros necesitan la extension .js
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import cors from "cors";

const app = express();
//Permite leer correctamente los datos JSON que nos mandan en request en el controlador
app.use(express.json());

//Obtendremos las variables de entorno
dotenv.config();

//Conexion a la BD
conectarDB();

//Configuracion de cors
const dominiosPermitidos = ["http://localhost:5173"];

const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS Policity"));
        }
    }
}

app.use(cors(corsOptions))

//Ruta
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

//Puerto
const PORT = process.env.PORT || 4000;

//Puerto para correr el sistema
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});











