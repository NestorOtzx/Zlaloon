const database = require('../config/mongodb');

exports.signUpController = async (req, res) => {
    const userdata = req.body;
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{  
      const result = await users.insertOne(userdata);
      res.status(201).json({message: `Usuario registrado con exito`});
    }catch (err){
      res.status(500).json({error: err.message});
    }
}