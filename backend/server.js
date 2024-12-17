const express = require('express');
const cors = require('cors');
const database = require('./config/mongodb');

require('dotenv').config();

//Express
const app = express(); //inicializar express
app.use(express.json()); //activar express.json para responder solicitudes con jsons
app.use(cors()); //activar cors para solicitudes externas

//Conectar a la base de datos
database.connect();

//rutas
const authroutes = require('./routes/authroutes');
app.use('/', authroutes);

//On close server
process.on('SIGINT', async () => {
  await database.disconnect();
  process.exit(0);
});

// Iniciar el servidor web
app.listen(5000, () => {
    console.log('Servidor en ejecución en el puerto http://localhost:5000');
});