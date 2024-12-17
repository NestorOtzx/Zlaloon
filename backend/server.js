const express = require('express');
const cors = require('cors');
const database = require('./config/mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_DB_URI;
//inicializar el cliente
const client = new MongoClient(uri);



//Express
const app = express(); //inicializar express
app.use(express.json()); //activar express.json para responder solicitudes con jsons
app.use(cors()); //activar cors para solicitudes externas

//Conectar a la base de datos
database.connect();


//Rutas
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});

app.post('/signup', async (req, res) => {
  const userdata = req.body;
  console.log("USUARIO REGISTRANDOSE!!!", userdata.username, userdata.email, userdata.password);
  const db = client.db("ZLALOON");
  const users = db.collection("Users");
  try{  
    const result = await users.insertOne(userdata);
    res.status(201).json({message: `Usuario registrado con exito`});
  }catch (err){
    res.status(500).json({error: err.message});
  }
}
) 


async function rundatabase(){
  try {
    // Connect the client to the server	(optional starting in v4.7)
    console.log("Voy a conectar a la base de datos!!");
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Conectado a la base de datos!!");
  } catch (err) {
    console.log("Hubo un error", err.message);
  }
}

//On close server
process.on('SIGINT', async () => {
  await client.close();
  database.disconnect();
  process.exit(0);
});

// Iniciar el servidor web
app.listen(5000, () => {
    console.log('Servidor en ejecución en el puerto http://localhost:5000');
    rundatabase().catch(console.error);
});