const database = require('../config/mongodb');
const {  ObjectId } = require("mongodb");

exports.getfollowing = async (req, res) => {
    const data = req.query;
    console.log("------------Get following-------------");
    console.log(data);
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
                console.log("cursor was given: ", cursor);
                query = {$and: [{ _id: { $in: userdata.following } }, {_id: {$gt: ObjectId.createFromHexString(cursor)}}]};
            }
            const usersFollowing = await users.find(query).limit(parseInt(limit)).toArray();
            console.log("Following: ", usersFollowing);
            res.status(200).json(usersFollowing);
        }
    }catch (error)
    {
        res.status(500).json({error: "error getting following"});
    }
}

exports.getfollowers = async (req, res) => {
    const data = req.query;
    console.log("------------Get followers-------------");
    console.log(data);
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
                console.log("cursor was given: ", cursor);
                query = {$and: [{ _id: { $in: userdata.followers } }, {_id: {$gt: ObjectId.createFromHexString(cursor)}}]};
            }
            const usersFollowers = await users.find(query).limit(parseInt(limit)).toArray();
            console.log("Following: ", usersFollowers);
            res.status(200).json(usersFollowers);
        }
    }catch (error)
    {
        res.status(500).json({error: "error getting user"});
    }
}





exports.getprofilebyusername = async (req, res) => {
    const data = req.query;
    console.log("-------------------------");
    console.log(data);
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{
        const username = data.username;
        console.log("Will search for ", username);
        const userdata = await users.findOne({username: username});

        delete userdata.password;
        if (!userdata)
        {
            res.status(404).json({error: "user not found"});    
        }else{
            console.log("User: ", userdata);
            res.status(200).json(userdata);
        }
    }catch (error)
    {
        res.status(500).json({error: "error getting user"});
    }
}

exports.getprofileslike = async (req, res) => {
    const data = req.query;
    console.log("-------------------------");
    console.log(data);
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{
        const likename = data.likename;
        const limit = data.limit;
        const cursor = data.cursor;

        console.log("Will search for ", likename);
        const query = { username: { $regex: likename, $options: "i" } };
    
        if (cursor)
        {
            console.log("cursor was given: ", cursor);
            query._id = {$gt: ObjectId.createFromHexString(cursor)};
        }
        const usersLike = await users.find(query).limit(parseInt(limit)).toArray();
        for (let i = 0; i<usersLike.length; i++)
        {
            delete usersLike.password;
        }

        console.log("Users like ", likename, ": ", usersLike);
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
    console.log(error);
    res.status(500).json({ error: "Error getting following status" });
  }
};
