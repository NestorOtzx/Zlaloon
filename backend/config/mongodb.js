const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_DB_URI;
console.log(uri);

//inicializar el cliente
const client = new MongoClient(uri);

exports.connect = async () =>
{
    try {
        console.log("Conectando a la base de datos...");
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Conectado a la base de datos!!");
      } catch (err) {
        console.log("Hubo un error", err.message);
    }
}

exports.disconnect = async () =>
{
    console.log("Cerrando la coneccion a la base de datos");
    await client.close();
    console.log("Conexión a la base de datos cerrada.");
}

exports.getCurrentInstance = () => {
    return client;
}
