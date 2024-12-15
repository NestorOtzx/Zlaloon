const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_URI;
//inicializar el cliente
const client = new MongoClient(uri);



//inicializar express
const app = express();
app.use(express.json()); 

//activar cors para solicitudes externas
app.use(cors());

// Ruta básica
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});


app.post('/signup', async (req, res) => {
  const {username, email, password, rpassword} = req.body;
  console.log("USUARIO REGISTRANDOSE!!!", username, email, password, rpassword);
  const db = client.db("ZLALOON");
  const users = db.collection("Users");
  try{  
    const result = await users.insertOne({ username: username, email: email, password: password});
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
    // Ensures that the client will close when you finish/error
    console.log("Hubo un error", err.message);
    
  }
}

process.on('SIGINT', async () => {
  await client.close();
  console.log('Conexión con MongoDB cerrada');
  process.exit(0);
});

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor en ejecución en el puerto http://localhost:5000');
    rundatabase().catch(console.error);
});