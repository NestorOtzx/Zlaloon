const database = require('../config/mongodb');

exports.signUpController = async (req, res) => {
    const userdata = req.body;
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{
      const emailQ = await users.findOne({email: userdata.email})
      let errors = {}
      if (emailQ){
        errors.email = 'El correo ya tiene una cuenta asociada.';
      }
      const usernameQ = await users.findOne({username: userdata.username})
      if (usernameQ){
        errors.username = 'El nombre de usuario ya está en uso.'
      }

      if (Object.keys(errors).length > 0)
      {
        res.status(409).json(errors);
      }
      else{
        const result = await users.insertOne(userdata);
        //Session management
        req.session.username = userdata.username;
        req.session.userid = userdata._id;
        res.status(201).json({message: `Usuario registrado con exito`});
      }
      
    }catch (err){
      res.status(500).json({error: err.message});
    }
}

exports.loginController = async (req, res) => {
  const userdata = req.body;
  const db = database.getCurrentInstance().db("ZLALOON");
  const users = db.collection("Users");
  try{
    let user = {}
    let errors = {}
    if (userdata["username"].includes('@'))
    {
      user = await users.findOne({email: userdata.username}); 
    }else{
      user = await users.findOne({username: userdata.username}); 
    }
    userdata._id = user._id;
    if (!user)
    {
      errors.username = 'El nombre de usuario, correo, o contraseña no coinciden';
    }else{
      if (user.password === userdata.password)
      {
      }else{
        errors.username = 'El nombre de usuario, correo, o contraseña no coinciden';
      }
    }
    
    if (Object.keys(errors).length > 0)
    {
      res.status(409).json(errors);
    }
    else{
      //Session management
      req.session.username = userdata.username;
      req.session.userid = userdata._id;
      res.status(201).json({message: `Usuario logeado con exito`});
    }
    
  }catch (err){
    res.status(500).json({error: err.message});
  }
}

exports.logoutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo cerrar la sesión" });
    }
    res.clearCookie("connect.sid"); // Limpiar la cookie de sesión
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  });
}