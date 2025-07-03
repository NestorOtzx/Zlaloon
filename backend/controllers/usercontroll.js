const database = require('../config/mongodb');
const {  ObjectId } = require("mongodb");
const { getCloudinary } = require('../config/cloudinarybucket');

exports.getfollowing = async (req, res) => {
    const data = req.query;
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{
        const username = data.username;
        const limit = data.limit;
        const cursor = data.cursor;

        const userdata = await users.findOne({username: username});

        if (!userdata)
        {
            res.status(404).json({error: "user not found"});    
        }else if (!userdata.following){
            res.status(200).json([]);    
        }else{
            let query = { _id: { $in: userdata.following } };
            if (cursor)
            {
                query = {$and: [{ _id: { $in: userdata.following } }, {_id: {$gt: ObjectId.createFromHexString(cursor)}}]};
            }
            const usersFollowing = await users.find(query).limit(parseInt(limit)).toArray();
            res.status(200).json(usersFollowing);
        }
    }catch (error)
    {
        res.status(500).json({error: "error getting following"});
    }
}

exports.getfollowers = async (req, res) => {
    const data = req.query;
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{
        const username = data.username;
        const limit = data.limit;
        const cursor = data.cursor;

        const userdata = await users.findOne({username: username});

        if (!userdata)
        {
            res.status(404).json({error: "user not found"});    
        }else if (!userdata.followers){
            res.status(200).json([]);    
        }else{
            let query = { _id: { $in: userdata.followers } };
            if (cursor)
            {
                query = {$and: [{ _id: { $in: userdata.followers } }, {_id: {$gt: ObjectId.createFromHexString(cursor)}}]};
            }
            const usersFollowers = await users.find(query).limit(parseInt(limit)).toArray();
            res.status(200).json(usersFollowers);
        }
    }catch (error)
    {
        res.status(500).json({error: "error getting user"});
    }
}





exports.getprofilebyusername = async (req, res) => {
    const data = req.query;
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{
        const username = data.username;
        const userdata = await users.findOne({username: username});

        delete userdata.password;
        if (!userdata)
        {
            res.status(404).json({error: "user not found"});    
        }else{
            res.status(200).json(userdata);
        }
    }catch (error)
    {
        res.status(500).json({error: "error getting user"});
    }
}

exports.getprofileslike = async (req, res) => {
    const data = req.query;
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{
        const likename = data.likename;
        const limit = data.limit;
        const cursor = data.cursor;

        const query = { username: { $regex: likename, $options: "i" } };
    
        if (cursor)
        {
            query._id = {$gt: ObjectId.createFromHexString(cursor)};
        }
        const usersLike = await users.find(query).limit(parseInt(limit)).toArray();
        for (let i = 0; i<usersLike.length; i++)
        {
            delete usersLike.password;
        }

        res.status(200).json(usersLike);
        
    }catch (error)
    {
        res.status(500).json({error: "error getting users"});
    }
}


exports.followprofile = async (req, res) => {
  const { userid, profileid } = req.body;
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const db = client.db("ZLALOON");
  const users = db.collection("Users");
  const follows = db.collection("Follows");

  try {
    const user = await users.findOne({ _id: ObjectId.createFromHexString(userid) });
    const profile = await users.findOne({ _id: ObjectId.createFromHexString(profileid) });

    if (!user || !profile) {
      return res.status(404).json({ error: "User or profile not found" });
    }

    session.startTransaction();

    const existingFollow = await follows.findOne({
      userId: user._id,
      profileId: profile._id,
    });

    if (!existingFollow) {
      await follows.insertOne({
        userId: user._id,
        profileId: profile._id,
        createdAt: new Date()
      });
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Followed successfully" });

  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

exports.unfollowprofile = async (req, res) => {
  const { userid, profileid } = req.body;
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const db = client.db("ZLALOON");
  const users = db.collection("Users");
  const follows = db.collection("Follows");

  try {
    const user = await users.findOne({ _id: ObjectId.createFromHexString(userid) });
    const profile = await users.findOne({ _id: ObjectId.createFromHexString(profileid) });

    if (!user || !profile) {
      return res.status(404).json({ error: "User or profile not found" });
    }

    session.startTransaction();

    await follows.deleteOne({
      userId: user._id,
      profileId: profile._id,
    });

    await session.commitTransaction();
    res.status(200).json({ message: "Unfollowed successfully" });

  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

exports.getisfollowing = async (req, res) => {
  const { username, profilename } = req.query;
  const db = database.getCurrentInstance().db("ZLALOON");
  const users = db.collection("Users");
  const follows = db.collection("Follows");

  try {
    const user = await users.findOne({ username });
    const profile = await users.findOne({ username: profilename });

    if (!user || !profile) {
      return res.status(404).json({ error: "User or profile not found" });
    }

    const follow = await follows.findOne({
      userId: user._id,
      profileId: profile._id,
    });

    res.status(200).json({ isfollowing: !!follow });

  } catch (error) {
    res.status(500).json({ error: "Error getting following status" });
  }
};


exports.updateprofileimages = async (req, res) => {
  try {
    const userId = req.body.userid;
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const cloudinary = getCloudinary();

    const updates = {};

    // Subir la foto de perfil si está presente
    if (req.files?.profilepicture?.[0]) {
      const profileUpload = await cloudinary.uploader.upload_stream({
        folder: 'zlaloon/profile_pictures',
        public_id: `profile_${userId}`,
        overwrite: true,
        transformation: [
          { width: 256, height: 256, crop: "fill", gravity: "face", quality: "auto" }
        ]
      }, async (error, result) => {
        if (error) {
          console.error("Error al subir imagen de perfil:", error);
          return res.status(500).json({ error: "Cloudinary error" });
        }
        updates.profilepicture = result.secure_url;
        // continuar si también hay fondo, si no, guardar y salir
        if (!req.files?.backgroundimage?.[0]) {
          await users.updateOne(
            { _id: ObjectId.createFromHexString(userId) },
            { $set: updates }
          );
          return res.status(200).json({ success: true, updates });
        }
      });

      profileUpload.end(req.files.profilepicture[0].buffer);
    }

    // Subir imagen de fondo si está presente
    if (req.files?.backgroundimage?.[0]) {
      const backgroundUpload = await cloudinary.uploader.upload_stream({
        folder: 'zlaloon/background_images',
        public_id: `background_${userId}`,
        overwrite: true,
        transformation: [
          { width: 1280, height: 360, crop: "fill", gravity: "auto", quality: "auto" }
        ]
      }, async (error, result) => {
        if (error) {
          console.error("Error al subir imagen de fondo:", error);
          return res.status(500).json({ error: "Cloudinary error" });
        }
        updates.backgroundimage = result.secure_url;

        // Actualizar el documento
        await users.updateOne(
          { _id: ObjectId.createFromHexString(userId) },
          { $set: updates }
        );

        return res.status(200).json({ success: true, updates });
      });

      backgroundUpload.end(req.files.backgroundimage[0].buffer);
    }

    // Si ninguna imagen fue enviada
    if (!req.files?.profilepicture?.[0] && !req.files?.backgroundimage?.[0]) {
      return res.status(400).json({ error: "No images received" });
    }

  } catch (error) {
    console.error("Error en updateprofileimages:", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
};


exports.deleteaccount = async (req, res) => {
  try {
    const { username, viewerUsername } = req.body;

    if (!username || !viewerUsername) {
      return res.status(400).json({ error: 'Missing username or viewerUsername' });
    }

    if (username !== viewerUsername) {
      return res.status(403).json({ error: 'Unauthorized operation' });
    }

    const db = database.getCurrentInstance().db('ZLALOON');
    const users = db.collection('Users');
    const posts = db.collection('Posts');
    const follows = db.collection('Follows');
    const likes = db.collection('Likes');
    const dislikes = db.collection('Dislikes');
    const shares = db.collection('Shares');
    const answers = db.collection('Answers');

    const user = await users.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userIdStr = user._id.toString();
    const userId = ObjectId.createFromHexString(userIdStr);
    const cloudinary = getCloudinary();

    // 1. Eliminar imágenes de perfil y fondo
    await cloudinary.api.delete_resources([
      `zlaloon/profile_pictures/profile_${userIdStr}`,
      `zlaloon/background_images/background_${userIdStr}`
    ]);

    // 2. Obtener posts del usuario y borrar imágenes
    const userPosts = await posts.find({ username }).toArray();
    const userPostIds = userPosts.map(p => ObjectId.createFromHexString(p._id.toString()));

    for (const post of userPosts) {
      if (Array.isArray(post.content?.images)) {
        const publicIds = post.content.images
          .map(url => {
            const match = url.match(/upload\/(?:v\d+\/)?(.*?)(?:\.[a-zA-Z]+)?$/);
            return match ? match[1] : null;
          })
          .filter(Boolean);

        if (publicIds.length > 0) {
          await cloudinary.api.delete_resources(publicIds);
        }
      }
    }

    // 3. Eliminar todos los datos relacionados
    await Promise.all([
      users.deleteOne({ _id: userId }),
      posts.deleteMany({ username }),
      follows.deleteMany({
        $or: [
          { userId: userId },
          { profileId: userId }
        ]
      }),
      likes.deleteMany({
        $or: [
          { userId: userId },
          { postId: { $in: userPostIds } }
        ]
      }),
      dislikes.deleteMany({
        $or: [
          { userId: userId },
          { postId: { $in: userPostIds } }
        ]
      }),
      shares.deleteMany({
        $or: [
          { userId: userId },
          { postId: { $in: userPostIds } }
        ]
      }),
      answers.deleteMany({
        $or: [
          { userId: userId },            // respuestas hechas por el usuario
          { postId: { $in: userPostIds } } // respuestas hechas hacia sus posts
        ]
      })
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error in deleteaccount:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
