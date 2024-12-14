const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://nestor:8I0yh5vtld5r3PN8@zlaloondb.iwwu0.mongodb.net/?retryWrites=true&w=majority&appName=ZlaloonDB";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    console.log("Voy a conectar!!");
    await client.connect();
    console.log("Conectado!!");
    
    const db = client.db("ZLALOON");
    const users = db.collection("Users");
    const result = await users.insertOne({ username: "testUser", password: "12345" });
    console.log("Usuario insertado:", result.insertedId);


  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.error);