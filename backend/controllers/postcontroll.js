const database = require('../config/mongodb');
const { ObjectId } = require('mongodb');
const { getCloudinary } = require('../config/cloudinarybucket'); // importa tu util
const cloudinary = getCloudinary(); // ya está configurado

function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'zlaloon/posts',
        public_id: filename,
        overwrite: true,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

exports.makepost = async (req, res) => {
  const db = database.getCurrentInstance().db('ZLALOON');
  const users = db.collection('Users');
  const posts = db.collection('Posts');
  const answers = db.collection('Answers'); // ⬅️ nueva colección

  try {
    const post_type = req.body.post_type || 'post';
    const username = req.body.username;
    const content = typeof req.body.content === 'string' ? JSON.parse(req.body.content) : req.body.content;
    const postref_id = req.body.postref_id;

    const user = await users.findOne({ username });
    if (!user) {
      return res.status(409).json({ username: 'The user does not exist.' });
    }

    const postdata = {
      username,
      date: new Date(),
      post_type,
      content,
    };

    if (post_type === 'reply' || post_type === 'share') {
      if (!postref_id) {
        return res.status(400).json({ error: 'Missing postref_id for reply/share' });
      }

      postdata.postref_id = ObjectId.createFromHexString(postref_id);
    }

    const files = req.files || [];
    const uploadedImageUrls = [];

    for (const [i, file] of files.entries()) {
      try {
        const imageUrl = await uploadToCloudinary(file.buffer, `post_${Date.now()}_${i}`);
        uploadedImageUrls.push(imageUrl);
      } catch (err) {
        console.error('Error uploading image to Cloudinary:', err);
      }
    }

    if (!postdata.content.images) postdata.content.images = [];
    postdata.content.images.push(...uploadedImageUrls);

    // Insertar el post
    const result = await posts.insertOne(postdata);

    // Si es una respuesta, insertar también en la colección Answers
    if (post_type === 'reply') {
      await answers.insertOne({
        postId: ObjectId.createFromHexString(postref_id),
        userId: user._id,
        replyId: result.insertedId, // opcional si quieres rastrear también la respuesta
        date: new Date(),
      });
    }

    res.status(201).json({ message: 'Post created!' });

  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: err.message });
  }
};





exports.addlike = async (req, res) => {
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
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");
  const likers = db.collection("Likes");
  const dislikers = db.collection("Dislikes");
  const sharers = db.collection("Shares");
  const answers = db.collection("Answers"); // ✅ Nuevo

  try {
    const profilename = data.username;
    const limit = parseInt(data.limit);
    const cursor = data.cursor;
    const viewerUsername = data.viewerUsername;

    const userdb = await users.findOne({ username: profilename });
    if (!userdb) return res.status(409).json({ username: "user does not exist" });

    let postquery = { username: profilename };
    if (cursor) {
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
      .limit(limit)
      .toArray();

    let viewer = null;
    if (viewerUsername) {
      viewer = await users.findOne({ username: viewerUsername });
    }

    for (const post of userPostsdb) {
      post.profilepicture = userdb.profilepicture || "";

      const [likesCount, dislikesCount, sharesCount, repliesCount] = await Promise.all([
        likers.countDocuments({ postId: post._id }),
        dislikers.countDocuments({ postId: post._id }),
        sharers.countDocuments({ postId: post._id }),
        answers.countDocuments({ postId: post._id }), // ✅ cantidad de respuestas
      ]);

      post.stats = {
        likes: likesCount,
        dislikes: dislikesCount,
        shares: sharesCount,
        replies: repliesCount, // ✅ agregado
      };

      if (!post.content) post.content = {};

      // Post compartido
      if (post.post_type === "share" && post.postref_id) {
        const shared = await posts.findOne({ _id: post.postref_id });

        if (shared) {
          const sharedUser = await users.findOne({ username: shared.username });
          shared.profilepicture = sharedUser?.profilepicture || "";

          const [sLikes, sDislikes, sShares, sReplies] = await Promise.all([
            likers.countDocuments({ postId: shared._id }),
            dislikers.countDocuments({ postId: shared._id }),
            sharers.countDocuments({ postId: shared._id }),
            answers.countDocuments({ postId: shared._id }),
          ]);

          shared.stats = {
            likes: sLikes,
            dislikes: sDislikes,
            shares: sShares,
            replies: sReplies,
          };
        }

        post.content.sharedpost = shared || null;
      }

      // Post en respuesta
      if (post.post_type === "reply" && post.postref_id) {
        const replied = await posts.findOne({ _id: post.postref_id });

        if (replied) {
          const repliedUser = await users.findOne({ username: replied.username });
          replied.profilepicture = repliedUser?.profilepicture || "";

          const [rLikes, rDislikes, rShares, rReplies] = await Promise.all([
            likers.countDocuments({ postId: replied._id }),
            dislikers.countDocuments({ postId: replied._id }),
            sharers.countDocuments({ postId: replied._id }),
            answers.countDocuments({ postId: replied._id }),
          ]);

          replied.stats = {
            likes: rLikes,
            dislikes: rDislikes,
            shares: rShares,
            replies: rReplies,
          };
        }

        post.content.replyTo = replied || null;
      }

      // Interacción del usuario autenticado
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

    res.status(200).json(userPostsdb);
  } catch (error) {
    console.error("Error in getprofileposts:", error);
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
  const answers = db.collection("Answers"); // ✅ Agregado

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

    post.profilepicture = userdb.profilepicture || "";

    const [likesCount, dislikesCount, sharesCount, repliesCount] = await Promise.all([
      likers.countDocuments({ postId: post._id }),
      dislikers.countDocuments({ postId: post._id }),
      sharers.countDocuments({ postId: post._id }),
      answers.countDocuments({ postId: post._id }), // ✅ conteo de respuestas
    ]);

    post.stats = {
      likes: likesCount,
      dislikes: dislikesCount,
      shares: sharesCount,
      replies: repliesCount, // ✅ añadido
    };

    if (!post.content) post.content = {};

    // Si es post compartido
    if (post.post_type === "share" && post.postref_id) {
      const shared = await posts.findOne({ _id: post.postref_id });

      if (shared) {
        const sharedUser = await users.findOne({ username: shared.username });
        shared.profilepicture = sharedUser?.profilepicture || "";

        const [sLikes, sDislikes, sShares, sReplies] = await Promise.all([
          likers.countDocuments({ postId: shared._id }),
          dislikers.countDocuments({ postId: shared._id }),
          sharers.countDocuments({ postId: shared._id }),
          answers.countDocuments({ postId: shared._id }),
        ]);

        shared.stats = {
          likes: sLikes,
          dislikes: sDislikes,
          shares: sShares,
          replies: sReplies,
        };
      }

      post.content.sharedpost = shared || null;
    }

    // Si es respuesta a otro post
    if (post.post_type === "reply" && post.postref_id) {
      const replied = await posts.findOne({ _id: post.postref_id });

      if (replied) {
        const repliedUser = await users.findOne({ username: replied.username });
        replied.profilepicture = repliedUser?.profilepicture || "";

        const [rLikes, rDislikes, rShares, rReplies] = await Promise.all([
          likers.countDocuments({ postId: replied._id }),
          dislikers.countDocuments({ postId: replied._id }),
          sharers.countDocuments({ postId: replied._id }),
          answers.countDocuments({ postId: replied._id }),
        ]);

        replied.stats = {
          likes: rLikes,
          dislikes: rDislikes,
          shares: rShares,
          replies: rReplies,
        };
      }

      post.content.replyTo = replied || null;
    }

    // Interacción del viewer
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

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getprofilepost:", error);
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
  const answers = db.collection("Answers"); // ✅ Agregado

  try {
    const { pattern, limit, cursor, viewerUsername } = data;

    const query = {
      $and: [
        {
          $or: [
            { username: { $regex: pattern, $options: "i" } },
            { "content.message": { $regex: pattern, $options: "i" } },
          ],
        },
        {
          $or: [{"content.message": { $exists: true, $ne: "" }},{"post_type": "share"}]
        },
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

    const uniqueUsernames = [...new Set(postsList.map(p => p.username))];
    const usersMap = new Map(
      (await users.find({ username: { $in: uniqueUsernames } }).toArray())
        .map(u => [u.username, u.profilepicture || ""])
    );

    let viewer = null;
    if (viewerUsername) {
      viewer = await users.findOne({ username: viewerUsername });
    }

    for (const post of postsList) {
      post.profilepicture = usersMap.get(post.username) || "";

      const [likesCount, dislikesCount, sharesCount, repliesCount] = await Promise.all([
        likers.countDocuments({ postId: post._id }),
        dislikers.countDocuments({ postId: post._id }),
        sharers.countDocuments({ postId: post._id }),
        answers.countDocuments({ postId: post._id }), // ✅ Cantidad de respuestas
      ]);

      post.stats = {
        likes: likesCount,
        dislikes: dislikesCount,
        shares: sharesCount,
        replies: repliesCount, // ✅ Añadido
      };

      // Agregar post compartido
      if (post.post_type === "share" && post.postref_id) {
        const shared = await posts.findOne({ _id: post.postref_id });
        if (!post.content) post.content = {};

        if (shared) {
          const sharedUser = await users.findOne({ username: shared.username });
          shared.profilepicture = sharedUser?.profilepicture || "";

          const [sLikes, sDislikes, sShares, sReplies] = await Promise.all([
            likers.countDocuments({ postId: shared._id }),
            dislikers.countDocuments({ postId: shared._id }),
            sharers.countDocuments({ postId: shared._id }),
            answers.countDocuments({ postId: shared._id }),
          ]);

          shared.stats = {
            likes: sLikes,
            dislikes: sDislikes,
            shares: sShares,
            replies: sReplies,
          };
        }

        post.content.sharedpost = shared || null;
      }

      // Agregar post respondido
      if (post.post_type === "reply" && post.postref_id) {
        const replied = await posts.findOne({ _id: post.postref_id });
        if (!post.content) post.content = {};

        if (replied) {
          const repliedUser = await users.findOne({ username: replied.username });
          replied.profilepicture = repliedUser?.profilepicture || "";

          const [rLikes, rDislikes, rShares, rReplies] = await Promise.all([
            likers.countDocuments({ postId: replied._id }),
            dislikers.countDocuments({ postId: replied._id }),
            sharers.countDocuments({ postId: replied._id }),
            answers.countDocuments({ postId: replied._id }),
          ]);

          replied.stats = {
            likes: rLikes,
            dislikes: rDislikes,
            shares: rShares,
            replies: rReplies,
          };
        }

        post.content.replyTo = replied || null;
      }

      // Interacciones del usuario viewer
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

    res.status(200).json(postsList);
  } catch (error) {
    console.error("Error in getpostslike:", error);
    res.status(500).json({ error: "error getting posts like pattern" });
  }
};



exports.getpostreplies = async (req, res) => {
  const data = req.query;
  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const users = db.collection("Users");
  const likers = db.collection("Likes");
  const dislikers = db.collection("Dislikes");
  const sharers = db.collection("Shares");
  const answers = db.collection("Answers"); // ✅ Agregado

  try {
    const { postId, limit, cursor, viewerUsername } = data;

    const query = {
      post_type: "reply",
      postref_id: ObjectId.createFromHexString(postId),
    };

    if (cursor) {
      query._id = { $lt: ObjectId.createFromHexString(cursor) };
    }

    const replies = await posts
      .find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .toArray();

    const usernames = replies.map(p => p.username);
    const usersMap = new Map(
      (await users.find({ username: { $in: usernames } }).toArray())
        .map(u => [u.username, u.profilepicture || ""])
    );

    let viewer = null;
    if (viewerUsername) {
      viewer = await users.findOne({ username: viewerUsername });
    }

    for (const reply of replies) {
      reply.profilepicture = usersMap.get(reply.username) || "";

      const [likes, dislikes, shares, replyCount] = await Promise.all([
        likers.countDocuments({ postId: reply._id }),
        dislikers.countDocuments({ postId: reply._id }),
        sharers.countDocuments({ postId: reply._id }),
        answers.countDocuments({ postId: reply._id }) 
      ]);

      reply.stats = {
        likes,
        dislikes,
        shares,
        replies: replyCount 
      };

      if (viewer) {
        const [liked, disliked, shared] = await Promise.all([
          likers.findOne({ userId: viewer._id, postId: reply._id }),
          dislikers.findOne({ userId: viewer._id, postId: reply._id }),
          sharers.findOne({ userId: viewer._id, postId: reply._id }),
        ]);

        reply.viewerInteraction = {
          liked: !!liked,
          disliked: !!disliked,
          shared: !!shared,
        };
      }

      if (reply.post_type === "share" || reply.post_type === "reply") {
        const original = await posts.findOne({ _id: reply.postref_id });
        if (!reply.content) reply.content = {};

        if (original) {
          const origUser = await users.findOne({ username: original.username });
          original.profilepicture = origUser?.profilepicture || "";

          const [oLikes, oDislikes, oShares, oReplyCount] = await Promise.all([
            likers.countDocuments({ postId: original._id }),
            dislikers.countDocuments({ postId: original._id }),
            sharers.countDocuments({ postId: original._id }),
            answers.countDocuments({ postId: original._id }) // ✅ También para original anidado
          ]);

          original.stats = {
            likes: oLikes,
            dislikes: oDislikes,
            shares: oShares,
            replies: oReplyCount
          };
        }

        reply.content.sharedpost = original || null;
      }
    }

    res.status(200).json(replies);
  } catch (err) {
    console.error("Error in getpostreplies:", err);
    res.status(500).json({ error: "Failed to get replies" });
  }
};




exports.deletepost = async (req, res) => {
  const { username, postid, userid } = req.body;

  if (!username || !postid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = database.getCurrentInstance().db("ZLALOON");
  const posts = db.collection("Posts");
  const likes = db.collection("Likes");
  const dislikes = db.collection("Dislikes");
  const shares = db.collection("Shares");
  const answers = db.collection("Answers");

  const session = db.client.startSession();

  try {
    await session.withTransaction(async () => {
      const postObjectId = ObjectId.createFromHexString(postid);

      // Obtener el post original
      const post = await posts.findOne({ _id: postObjectId }, { session });
      if (!post) return res.status(404).json({ error: "Post not found" });
      if (post.username !== username) return res.status(403).json({ error: "Unauthorized" });

      // Borrar el post
      await posts.deleteOne({ _id: postObjectId }, { session });

      // Si era un share, eliminar el share asociado
      if (post.post_type === "share" && post.postref_id) {
        await shares.deleteOne(
          {
            userId: ObjectId.createFromHexString(userid),
            postId: post.postref_id
          },
          { session }
        );
      }

      // Si era una respuesta, eliminar el answer asociado
      if (post.post_type === "reply" && post.postref_id) {
        await answers.deleteOne(
          {
            userId: ObjectId.createFromHexString(userid),
            postId: post.postref_id
          },
          { session }
        );
      }

      // Borrar imágenes en Cloudinary
      if (Array.isArray(post.content?.images)) {
        const publicIds = post.content.images
          .map(url => {
            const match = url.match(/upload\/(.*)$/);
            return match ? match[1] : null;
          })
          .filter(Boolean);

        if (publicIds.length > 0) {
          await cloudinary.api.delete_resources(publicIds);
        }
      }

      // Borrar interacciones
      await likes.deleteMany({ postId: postid }, { session });
      await dislikes.deleteMany({ postId: postid }, { session });
      await shares.deleteMany({ postId: postid }, { session });
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  } finally {
    await session.endSession();
  }
};
