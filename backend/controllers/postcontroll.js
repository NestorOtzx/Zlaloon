const database = require('../config/mongodb');
const {  ObjectId } = require("mongodb");

exports.makepost = async (req, res) => {
    console.log("Make post here, body: ", req.body);
    const postdata = req.body;
    postdata.date = new Date();
    postdata.post_type = "post";
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    const posts = db.collection("Posts");
    try{
      const usernameQ = await users.findOne({username: postdata.username});

      let errors = {};

      if (!usernameQ){
        errors.username = 'The user does not exist.';
        console.log("User wasnt found");
      }
      console.log("User was found!!");

      if (Object.keys(errors).length > 0)
      {
        res.status(409).json(errors);
      }
      else{
        console.log("will create post!!");
        const result = await posts.insertOne(postdata);
        console.log("post created!! ", result);
        res.status(201).json({message: `Post created!`});
      }

    }catch (err){
      res.status(500).json({error: err.message});
    }
}

exports.addlike = async (req, res) => {
  console.log("Add like, body: ", req.body);
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const postdata = req.body;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");

  try{
    const userdb = await users.findOne({username: postdata.username});

    let errors = {};

    if (!userdb){
      errors.username = 'The user does not exist.';
      console.log("User wasnt found");
    }
    console.log("User was found!!");

    if (Object.keys(errors).length > 0)
    {
      res.status(409).json(errors);
    }
    else{
      session.startTransaction();
      console.log("will add like!!");

      const updatedLikes = await posts.updateOne({_id: ObjectId.createFromHexString(postdata.postid)},
         { $addToSet: { likers: userdb._id } }
        );
      const updatedDisliks = await posts.updateOne({_id: ObjectId.createFromHexString(postdata.postid)},
          { $pull: { dislikers: userdb._id } }
        );

      console.log("post updated", updatedLikes, updatedDisliks);
      await session.commitTransaction();

      res.status(201).json({message: `Like added!`});
    }

  }catch (err){
    res.status(500).json({error: err.message});
  }finally{
    session.endSession();
  }
}


exports.adddislike = async (req, res) => {
  console.log("Add like, body: ", req.body);
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const postdata = req.body;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");

  try{
    const userdb = await users.findOne({username: postdata.username});

    let errors = {};

    if (!userdb){
      errors.username = 'The user does not exist.';
      console.log("User wasnt found");
    }
    console.log("User was found!!");

    if (Object.keys(errors).length > 0)
    {
      res.status(409).json(errors);
    }
    else{
      session.startTransaction();
      console.log("will add like!!");

      const updatedLikes = await posts.updateOne({_id: ObjectId.createFromHexString(postdata.postid)},
         { $pull: { likers: userdb._id } }
        );
      
      const updatedDisliks = await posts.updateOne({_id: ObjectId.createFromHexString(postdata.postid)},
          { $addToSet: { dislikers: userdb._id } }
        );

      console.log("post updated", updatedLikes, updatedDisliks);
      await session.commitTransaction();

      res.status(201).json({message: `Dislike added!`});
    }

  }catch (err){
    res.status(500).json({error: err.message});
  }finally{
    session.endSession();
  }
}

exports.removelike = async (req, res) => {
  console.log("Add like, body: ", req.body);
  const postdata = req.body;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");

  try{
    const userdb = await users.findOne({username: postdata.username});

    let errors = {};

    if (!userdb){
      errors.username = 'The user does not exist.';
      console.log("User wasnt found");
    }
    console.log("User was found!!");

    if (Object.keys(errors).length > 0)
    {
      res.status(409).json(errors);
    }
    else{
      console.log("will remove like!!");

      const updatedLikes = await posts.updateOne({_id: ObjectId.createFromHexString(postdata.postid)},
         { $pull: { likers: userdb._id } }
        );

      console.log("post updated", updatedLikes);

      res.status(201).json({message: `Like removed!`});
    }

  }catch (err){
    res.status(500).json({error: err.message});
  }
}

exports.removedislike = async (req, res) => {
  console.log("Add dislike, body: ", req.body);
  const postdata = req.body;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");

  try{
    const userdb = await users.findOne({username: postdata.username});

    let errors = {};

    if (!userdb){
      errors.username = 'The user does not exist.';
      console.log("User wasnt found");
    }
    console.log("User was found!!");

    if (Object.keys(errors).length > 0)
    {
      res.status(409).json(errors);
    }
    else{
      console.log("will remove like!!");

      const updatedDislikes = await posts.updateOne({_id: ObjectId.createFromHexString(postdata.postid)},
         { $pull: { dislikers: userdb._id } }
        );

      console.log("post updated", updatedDislikes);

      res.status(201).json({message: `Dislike removed!`});
    }

  }catch (err){
    res.status(500).json({error: err.message});
  }
}


exports.addshare = async (req, res) => {
  console.log("Add share, body: ", req.body);
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const postdata = req.body;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");

  try{
    const userdb = await users.findOne({username: postdata.username});

    let errors = {};

    if (!userdb){
      errors.username = 'The user does not exist.';
      console.log("User wasnt found");
    }
    console.log("User was found!!");

    if (Object.keys(errors).length > 0)
    {
      res.status(409).json(errors);
    }
    else{
      session.startTransaction();
      console.log("will add share!!");

      const updatedShare = await posts.updateOne({_id: ObjectId.createFromHexString(postdata.postid)},
         { $addToSet: { sharers: userdb._id } }
        );

      const sharepost = {
        username: userdb.username,
        postref_id: ObjectId.createFromHexString(postdata.postid),
        post_type: "share",
        date: new Date()
      }

      const updateUser = await users.updateOne({_id:userdb._id}, {$addToSet: {shared: ObjectId.createFromHexString(postdata.postid)}})
      
      const insetPost = await posts.insertOne(sharepost);

      console.log("post updated", updatedShare, updateUser, insetPost);
      await session.commitTransaction();

      res.status(201).json({message: `Share added!`});
    }

  }catch (err){
    res.status(500).json({error: err.message});
  }finally{
    session.endSession();
  }
}

exports.removeshare = async (req, res) => {
  console.log("Remove share, body: ", req.body);
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const postdata = req.body;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");

  try{
    const userdb = await users.findOne({username: postdata.username});

    let errors = {};

    if (!userdb){
      errors.username = 'The user does not exist.';
      console.log("User wasnt found");
    }
    console.log("User was found!!");

    if (Object.keys(errors).length > 0)
    {
      res.status(409).json(errors);
    }
    else{
      session.startTransaction();
      console.log("will remove share!!");

      const updatedShare = await posts.updateOne({_id: ObjectId.createFromHexString(postdata.postid)},
         { $pull: { sharers: userdb._id } }
        );
      
      console.log("userdb: ", userdb);
      const updateUser = await users.updateOne({_id:userdb._id}, {$pull: {shared: {postid: ObjectId.createFromHexString(postdata.postid)}}})

      console.log("post updated", updatedShare, updateUser);
      await session.commitTransaction();

      res.status(201).json({message: `Share added!`});
    }

  }catch (err){
    res.status(500).json({error: err.message});
  }finally{
    session.endSession();
  }
}

exports.getprofileposts = async (req, res) => {
    const data = req.query;
    console.log("------------GET POSTS-------------");
    console.log(data);
    const db = database.getCurrentInstance().db("ZLALOON");
    const posts = db.collection("Posts");
    const users = db.collection("Users");
    try{
        const profilename = data.username;
        const limit = data.limit;
        const cursor = data.cursor;

        const userdb = await users.findOne({username: profilename});

        if (!userdb)
        {   
          res.status(409).json({username: "user does not exist"});    
        }else{
            let postquery = {username: profilename};

            if (cursor)
            {
                console.log("cursor was given: ", cursor);
                postquery =  { $and: [{username: profilename}, {_id: {$lt: ObjectId.createFromHexString(cursor)}}]};
            }

            const userPostsdb = await posts.find(postquery).sort({date:-1}).limit(parseInt(limit)).toArray();
            for (let i = 0; i<userPostsdb.length; i++)
            {
              if (userPostsdb[i].post_type == "share")
              {
                let sharedpost = await posts.findOne({_id: userPostsdb[i].postref_id});
                if (!userPostsdb[i].content)
                {
                  userPostsdb[i].content = {};
                }
                userPostsdb[i].content["sharedpost"] = sharedpost;
                console.log("content updated: ",  userPostsdb[i]);
              }
            }

            res.status(200).json(userPostsdb);
        }
    }catch (error)
    {
      console.log(error);
      res.status(500).json({error: "error getting posts"});
    }
}

exports.getprofilepost = async (req, res) => {
    const data = req.query;
    console.log("------------GET POST-------------");
    console.log(data);
    const db = database.getCurrentInstance().db("ZLALOON");
    const posts = db.collection("Posts");
    const users = db.collection("Users");
    try{
        const profilename = data.username;
        const post_id = data.postid;

        const userdb = await users.findOne({username: profilename});

        if (!userdb)
        {   
          res.status(409).json({username: "user does not exist"});    
        }else{
            const postquery =  { $and: [{username: profilename}, {_id: {$eq: ObjectId.createFromHexString(post_id)}}]};

            const userPostdb = await posts.findOne(postquery);
            if (userPostdb.post_type == "share")
            {
              let sharedpost = await posts.findOne({_id: userPostdb.postref_id});
              if (!userPostdb.content)
              {
                userPostdb.content = {};
              }
              userPostdb.content["sharedpost"] = sharedpost;
              console.log("content updated: ",  userPostdb);
            }

            res.status(200).json(userPostdb);
        }
    }catch (error)
    {
      console.log(error);
      res.status(500).json({error: "error getting posts"});
    }
}

exports.getpostslike = async (req, res) => {
  const data = req.query;
  console.log("--------------GET POSTS LIKE-----------");
  console.log(data);
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");

  try {
    const pattern = data.pattern;
    const limit = data.limit;
    const cursor = data.cursor;

    console.log("Will search for ", pattern);

    const query = {
      $or: [
        { username: { $regex: pattern, $options: "i" } },
        { "content.message": { $regex: pattern, $options: "i" } }
      ]
    };

    if (cursor) {
      console.log("cursor was given: ", cursor);
      query._id = { $lt: ObjectId.createFromHexString(cursor) };
    }

    const postsLike = await posts
      .find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .toArray();

    // Verifica si es un post compartido
    for (let i = 0; i < postsLike.length; i++) {
      const post = postsLike[i];
      if (post.post_type === "share" && post.postref_id) {
        const shared = await posts.findOne({ _id: post.postref_id });
        if (!post.content) {
          post.content = {};
        }
        post.content.sharedpost = shared || null;
        console.log("shared content injected: ", post.content.sharedpost);
      }
    }

    res.status(200).json(postsLike);
  } catch (error) {
    console.error("Error fetching posts like:", error);
    res.status(500).json({ error: "error getting posts like pattern" });
  }
};