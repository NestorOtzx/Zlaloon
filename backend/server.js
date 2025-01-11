const express = require('express');
const cors = require('cors');
const database = require('./config/mongodb');
const session = require("express-session");

require('dotenv').config();

//Express
const app = express(); //inicializar express
app.use(express.json()); //activar express.json para responder solicitudes con jsons
app.use(cors({
  origin: "http://localhost:3000", // Permitir solo solicitudes desde localhost:3000
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
  credentials: true})); //activar cors para solicitudes externas

//Conectar a la base de datos
database.connect();

//Sesiones
app.use(
  session({
    secret: "claveSecretaSuperSegura",// Clave secreta para firmar la sesión
    resave: false,                    // No guardar la sesión si no hay cambios
    saveUninitialized: false,         // No guardar sesiones vacías
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,    // La sesión dura 1 día (en milisegundos)
      httpOnly: true,                 // Evita acceso desde JavaScript en el navegador
      secure: false                   // Cambia a true si usas HTTPS
    }
  })
);

//Rutas
const authroutes = require('./routes/authroutes');
const homeroutes = require('./routes/homeroutes');
const postroutes = require('./routes/postroutes');
app.use('/', authroutes);
app.use('/', homeroutes);
app.use('/', postroutes);



//On close server
process.on('SIGINT', async () => {
  await database.disconnect();
  process.exit(0);
});

// Iniciar el servidor web
app.listen(5000, () => {
    console.log('Servidor en ejecución en el puerto http://localhost:5000');
});