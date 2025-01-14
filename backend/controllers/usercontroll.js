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

exports.getisfollowing = async (req, res) => {
    const data = req.query;
    console.log("------------Get is following-------------");
    console.log(data);
    const db = database.getCurrentInstance().db("ZLALOON");
    const users = db.collection("Users");
    try{
        console.log("user: ", data.username, " profile: ", data.profilename);
        const userdata = await users.findOne({username: data.username});
        const profiledata = await users.findOne({username: data.profilename});
        
        console.log("2 user: ", userdata, " profile: ", profiledata);

        if (!userdata)
        {    
            console.log(1);
            res.status(404).json({error: "user not found"});    
        }else if (!profiledata){
            console.log(2);
            res.status(404).json({error: "profile not found"});    
        }
        else if (!userdata.following || userdata.following == 0){
            console.log(3);
            res.status(200).json({isfollowing:false});    
        }else{
            console.log(4);
            let ans = false;
            for(let i = 0; i<userdata.following.length; i++)
            {
                console.log("comparing: ", userdata.following[i], " with: ", profiledata._id);
                if (userdata.following[i].equals(profiledata._id)){
                    console.log("are equal: ", userdata.following[i], " with: ", profiledata._id);
                    ans = true;
                    break;
                }
            }
            if (ans)
            {
                console.log("isfollowing true");
                res.status(200).json({isfollowing: true});
            }else{
                console.log("isfollowing false");
                res.status(200).json({isfollowing: false});
            }
        }
    }catch (error)
    {
        console.log(error);
        res.status(500).json({error: "error getting following"});
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
    console.log("follow body: ", req.body);
    const postdata = req.body;
    const client = database.getCurrentInstance()
    const session = client.startSession();
    const db = client.db("ZLALOON");
    const users = db.collection("Users");

    try{
        let errors = {};
        const user = await users.findOne({_id:  ObjectId.createFromHexString(postdata.userid)});
        const profile = await users.findOne({_id:  ObjectId.createFromHexString(postdata.profileid)});

        if (!user)
        {
            errors.username = 'The user does not exist.';
            console.log("User wasnt found");
        }
        if (!profile)
        {
            errors.profilename = 'The profile does not exist.';
            console.log("Profile wasnt found");
        }
        if (Object.keys(errors).length > 0)
        {
            res.status(409).json(errors);
        }
        else{
            session.startTransaction();

            const updatedUser = await users.updateOne({_id: user._id},
                { $addToSet: { following: profile._id } }
                );
            console.log("update user:", updatedUser);
            const updatedProfile = await users.updateOne({_id: profile._id},
                { $addToSet: { followers: user._id } }
                );
            await session.commitTransaction();
            res.status(200).json({message: "followed succesfully"});
        }
    }catch (err){
        await session.abortTransaction();
        res.status(500).json({error: err.message});
    }finally{
        session.endSession();
    }
}

exports.unfollowprofile = async (req, res) => {
    console.log("unfollow body: ", req.body);
    const postdata = req.body;
    const client = database.getCurrentInstance()
    const session = client.startSession();
    const db = client.db("ZLALOON");
    const users = db.collection("Users");

    try{
        let errors = {};
        const user = await users.findOne({_id: ObjectId.createFromHexString(postdata.userid)});
        const profile = await users.findOne({_id:  ObjectId.createFromHexString(postdata.profileid)});

        if (!user)
        {
            errors.username = 'The user does not exist.';
            console.log("User wasnt found");
        }
        if (!profile)
        {
            errors.profilename = 'The profile does not exist.';
            console.log("Profile wasnt found");
        }
        if (Object.keys(errors).length > 0)
        {
            res.status(409).json(errors);
        }
        else{
            session.startTransaction();

            const updatedUser = await users.updateOne({_id: user._id},
                { $pull: { following: profile._id } }
                );
            console.log("update user:", updatedUser);
            const updatedProfile = await users.updateOne({_id: profile._id},
                { $pull: { followers: user._id } }
                );
            await session.commitTransaction();
            res.status(200).json({message: "unfollowed succesfully"});
        }
    }catch (err){
        await session.abortTransaction();
        res.status(500).json({error: err.message});
    }finally{
        session.endSession();
    }
}