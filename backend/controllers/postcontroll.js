const database = require('../config/mongodb');
const {  ObjectId } = require("mongodb");

exports.makepost = async (req, res) => {
    //console.log("Make post here, body: ", req.body);
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
        //console.log("User wasnt found");
      }
      //console.log("User was found!!");

      if (Object.keys(errors).length > 0)
      {
        res.status(409).json(errors);
      }
      else{
        //console.log("will create post!!");
        const result = await posts.insertOne(postdata);
        //console.log("post created!! ", result);
        res.status(201).json({message: `Post created!`});
      }

    }catch (err){
      res.status(500).json({error: err.message});
    }
}

exports.addlike = async (req, res) => {
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const db = client.db("ZLALOON");
  const { username, postid } = req.body;
  //console.log("add like!!!!!!")

  try {
    const users = db.collection("Users");
    const likes = db.collection("Likes");
    const dislikes = db.collection("Dislikes");

    const user = await users.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user._id;
    const postId = ObjectId.createFromHexString(postid);

    await session.withTransaction(async () => {
      await dislikes.deleteOne({ userId, postId });
      await likes.updateOne(
        { userId, postId },
        { $set: { userId, postId } },
        { upsert: true }
      );
    });

    res.status(201).json({ message: "Like added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

exports.adddislike = async (req, res) => {
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const db = client.db("ZLALOON");
  const { username, postid } = req.body;

  try {
    const users = db.collection("Users");
    const likes = db.collection("Likes");
    const dislikes = db.collection("Dislikes");

    const user = await users.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user._id;
    const postId = ObjectId.createFromHexString(postid);

    await session.withTransaction(async () => {
      await likes.deleteOne({ userId, postId });
      await dislikes.updateOne(
        { userId, postId },
        { $set: { userId, postId } },
        { upsert: true }
      );
    });

    res.status(201).json({ message: "Dislike added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

exports.removelike = async (req, res) => {
  const db = database.getCurrentInstance().db("ZLALOON");
  const { username, postid } = req.body;

  try {
    const users = db.collection("Users");
    const likes = db.collection("Likes");

    const user = await users.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user._id;
    const postId = ObjectId.createFromHexString(postid);

    await likes.deleteOne({ userId, postId });
    res.status(200).json({ message: "Like removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removedislike = async (req, res) => {
  const db = database.getCurrentInstance().db("ZLALOON");
  const { username, postid } = req.body;

  try {
    const users = db.collection("Users");
    const dislikes = db.collection("Dislikes");

    const user = await users.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user._id;
    const postId = ObjectId.createFromHexString(postid);

    await dislikes.deleteOne({ userId, postId });
    res.status(200).json({ message: "Dislike removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addshare = async (req, res) => {
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const db = client.db("ZLALOON");
  const { username, postid } = req.body;

  try {
    const users = db.collection("Users");
    const posts = db.collection("Posts");
    const shares = db.collection("Shares");

    const user = await users.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user._id;
    const postId = ObjectId.createFromHexString(postid);

    await session.withTransaction(async () => {
      await shares.updateOne(
        { userId, postId },
        { $set: { userId, postId } },
        { upsert: true }
      );

      await posts.insertOne({
        username,
        post_type: "share",
        postref_id: postId,
        date: new Date(),
      });
    });

    res.status(201).json({ message: "Share added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

exports.removeshare = async (req, res) => {
  const client = database.getCurrentInstance();
  const session = client.startSession();
  const db = client.db("ZLALOON");
  const { username, postid } = req.body;

  try {
    const users = db.collection("Users");
    const posts = db.collection("Posts");
    const shares = db.collection("Shares");

    const user = await users.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user._id;
    const postId = ObjectId.createFromHexString(postid);

    await session.withTransaction(async () => {
      await shares.deleteOne({ userId, postId });
      await posts.deleteOne({
        username,
        post_type: "share",
        postref_id: postId,
      });
    });

    res.status(200).json({ message: "Share removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};


exports.getprofileposts = async (req, res) => {
  const data = req.query;
  //console.log("------------GET POSTS XXXXXXXXXXXXXXXXXX-------------");
  //console.log(data);

  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");
  const likers = db.collection("Likes");
  const dislikers = db.collection("Dislikes");
  const sharers = db.collection("Shares");

  try {
    const profilename = data.username;
    const limit = data.limit;
    const cursor = data.cursor;
    const viewerUsername = data.viewerUsername;

    const userdb = await users.findOne({ username: profilename });
    if (!userdb) {
      return res.status(409).json({ username: "user does not exist" });
    }

    let postquery = { username: profilename };
    if (cursor) {
      //console.log("cursor was given: ", cursor);
      postquery = {
        $and: [
          { username: profilename },
          { _id: { $lt: ObjectId.createFromHexString(cursor) } }
        ]
      };
    }

    const userPostsdb = await posts
      .find(postquery)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .toArray();

    // Si hay usuario que visualiza, obtener su _id
    let viewer = null;
    if (viewerUsername) {
      viewer = await users.findOne({ username: viewerUsername });
    }

    for (let i = 0; i < userPostsdb.length; i++) {

      // Adjuntar contenido compartido si es necesario
      if (userPostsdb[i].post_type === "share") {
        const shared = await posts.findOne({ _id: userPostsdb[i].postref_id });
        if (!userPostsdb[i].content) userPostsdb[i].content = {};
        userPostsdb[i].content.sharedpost = shared || null;
        //console.log("content updated: ", userPostsdb[i]);
      }

      // Si hay usuario autenticado, verificar interacciones
      if (viewer) {
        const [liked, disliked, shared] = await Promise.all([
          likers.findOne({ userId: viewer._id, postId: userPostsdb[i]._id }),
          dislikers.findOne({ userId: viewer._id, postId: userPostsdb[i]._id }),
          sharers.findOne({ userId: viewer._id, postId: userPostsdb[i]._id }),
        ]);
        userPostsdb[i].viewerInteraction = {
          liked: !!liked,
          disliked: !!disliked,
          shared: !!shared,
        };
      }
      
    }
    //console.log(viewer, userPostsdb)
    res.status(200).json(userPostsdb);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: "error getting posts" });
  }
};


exports.getprofilepost = async (req, res) => {
  const data = req.query;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");
  const likers = db.collection("Likes");
  const dislikers = db.collection("Dislikes");
  const sharers = db.collection("Shares");

  try {
    const profilename = data.username;
    const post_id = data.postid;
    const viewerUsername = data.viewerUsername;

    const userdb = await users.findOne({ username: profilename });
    if (!userdb) return res.status(409).json({ username: "user does not exist" });

    const post = await posts.findOne({
      username: profilename,
      _id: { $eq: ObjectId.createFromHexString(post_id) },
    });

    if (!post) return res.status(404).json({ error: "post not found" });

    // Adjuntar shared content si es un post tipo "share"
    if (post.post_type === "share") {
      const shared = await posts.findOne({ _id: post.postref_id });
      if (!post.content) post.content = {};
      post.content.sharedpost = shared || null;
    }

    // Si hay usuario logueado, verificar interacciones
    if (viewerUsername) {
      const viewer = await users.findOne({ username: viewerUsername });
      if (viewer) {
        const [liked, disliked, shared] = await Promise.all([
          likers.findOne({ userId: viewer._id, postId: post._id }),
          dislikers.findOne({ userId: viewer._id, postId: post._id }),
          sharers.findOne({ userId: viewer._id, postId: post._id }),
        ]);
        post.viewerInteraction = {
          liked: !!liked,
          disliked: !!disliked,
          shared: !!shared,
        };
      }
    }
    //console.log(post)
    res.status(200).json(post);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: "error getting post" });
  }
};


exports.getpostslike = async (req, res) => {
  const data = req.query;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");
  const likers = db.collection("Likes");
  const dislikers = db.collection("Dislikes");
  const sharers = db.collection("Shares");

  try {
    const { pattern, limit, cursor, viewerUsername } = data;
    //console.log("Data:", data);

    const query = {
      $or: [
        { username: { $regex: pattern, $options: "i" } },
        { "content.message": { $regex: pattern, $options: "i" } },
      ],
    };

    if (cursor) {
      query._id = { $lt: ObjectId.createFromHexString(cursor) };
    }

    const postsList = await posts
      .find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .toArray();

    let viewer = null;
    if (viewerUsername) {
      viewer = await users.findOne({ username: viewerUsername });
    }

    for (const post of postsList) {
      if (post.post_type === "share" && post.postref_id) {
        const shared = await posts.findOne({ _id: post.postref_id });
        if (!post.content) post.content = {};
        post.content.sharedpost = shared || null;
      }

      if (viewer) {
        const [liked, disliked, shared] = await Promise.all([
          likers.findOne({ userId: viewer._id, postId: post._id }),
          dislikers.findOne({ userId: viewer._id, postId: post._id }),
          sharers.findOne({ userId: viewer._id, postId: post._id }),
        ]);
        post.viewerInteraction = {
          liked: !!liked,
          disliked: !!disliked,
          shared: !!shared,
        };
      }
    }

    //console.log(postsList);
    res.status(200).json(postsList);
  } catch (error) {
    //console.error("Error fetching posts like:", error);
    res.status(500).json({ error: "error getting posts like pattern" });
  }
};
