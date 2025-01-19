import './Post.css';
import formatDateTime from '../Utilities/formatDateTime';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Post(props)
{   
    const getLikedByUser = () =>
    {
        if (!userdata.loggedin || !props.data.likers) { return false; }
        let ans = false;
        console.log("userdata: ", userdata);
        console.log("post data: ", props.data);
        for (let i = 0; i< props.data.likers.length; i++)
        {
            console.log("comparing ", userdata.userid, " with: ", props.data.likers[i])
            if (userdata.userid == props.data.likers[i])
            {
                ans = true;
                break;
            }
        }
        return ans;
    }
    const getDislikedByUser = () =>
    {
        if (!userdata.loggedin || !props.data.dislikers) { return false; }
        let ans = false;
        console.log("userdata: ", userdata);
        console.log("post data: ", props.data);
        for (let i = 0; i< props.data.dislikers.length; i++)
        {
            console.log("comparing ", userdata.userid, " with: ", props.data.dislikers[i])
            if (userdata.userid == props.data.dislikers[i])
            {
                ans = true;
                break;
            }
        }
        return ans;
    }


    const [mylike, setMyLike] = useState(props.data.likers ? props.data.likers.length: 0);
    const [mydislike, setMyDislike] =  useState(props.data.dislikers ? props.data.dislikers.length: 0);
    const [myshares, setMyShare] =  useState(props.data.sharers ? props.data.sharers.length: 0);

    const [loading, setLoading] = useState(false);
    
    const [errors, setErrors] = useState(null);
    const userdata = useSelector((state) => state.userdata);

    const [userliked, setUserLiked] = useState(getLikedByUser());
    const [userdisliked, setUserDisliked] = useState(getDislikedByUser());

    const LikeDislikeButton = async (like)=>
    {
        if (loading) { return; }
        console.log("FOLLOW/UNFOLLOW CLICKED!!");
        const data = {username: userdata.username, postid: props.data._id};
        console.log("will add like/dislike, data: ", data);
        const prevliked = userliked;
        const prevdisliked = userdisliked;

        try {
            let response;
            setLoading(true);
            if (like)
            {
                if (userliked)
                {
                    setUserLiked(false);
                    setMyLike(mylike-1);
                    response = await axios.post("http://localhost:5000/removelike", data, { withCredentials: true });
                }else{
                    setUserLiked(true); setUserDisliked(false);
                    setMyLike(mylike+1);
                    if (userdisliked)
                    {
                        setMyDislike(mydislike-1);
                    }
                    response = await axios.post("http://localhost:5000/addlike", data, { withCredentials: true });
                }
            }else{
                if (userdisliked)
                {
                    setUserDisliked(false);
                    setMyDislike(mydislike-1);
                    response = await axios.post("http://localhost:5000/removedislike", data, { withCredentials: true });
                }else{
                    setUserLiked(false); setUserDisliked(true);
                    setMyDislike(mydislike+1);
                    if (userliked)
                    {
                        setMyLike(mylike-1);    
                    }
                    response = await axios.post("http://localhost:5000/adddislike", data, { withCredentials: true });
                }
            }
            //console.log("Exito! mensaje de respuesta: ", response.data.message);
        } catch (error) {
            if (error.response) {
                setUserDisliked(prevdisliked);
                setUserLiked(prevliked);
                console.error("Client error:", error.response.data);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                alert("Error: No hubo respuesta del servidor.");
            } else {
                console.error("Error making post:", error.message);
                alert("Error: " + error.message);
            }
            //setErrors(error.message); 
        } finally {
            setLoading(false);
            //window.location.reload();
        }
    }

    const ShareButton = async ()=>
    {
        if (loading) { return; }
        console.log("shared CLICKED!!");
        const data = {username: userdata.username, postid: props.data._id};
        console.log("will add like/dislike, data: ", data);

        try {
            let response;
            setLoading(true);
            setMyShare(myshares+1);
            response = await axios.post("http://localhost:5000/addshare", data, { withCredentials: true });
        } catch (error) {
            if (error.response) {
                console.error("Client error:", error.response.data);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                alert("Error: No hubo respuesta del servidor.");
            } else {
                console.error("Error making post:", error.message);
                alert("Error: " + error.message);
            }
            //setErrors(error.message); 
        } finally {
            setLoading(false);
            //window.location.reload();
        }
    }

    return (
        <div className="postcontainer" onClick={(event) => event.stopPropagation()}>
            <div className="postvalues">
                <div className = "postinfo">
                    <div className = "postuserinfo">
                        <img className = "postprofilepicture" src = "images/nopp.png"></img>            
                        <span className = "postusername">{props.data.username}</span>
                    </div>
                    <div className = "basicinfo">
                        <span>{formatDateTime(props.data.date)}</span>
                    </div>
                </div>
                <div className = "postcontent">
                    {props.data.post_type == "post" && props.data.content &&
                    <div>
                        <span>{props.data.content.message}</span>    
                    </div>}
                    {props.data.post_type == "share" && props.data.content &&
                    <div className='sharecontent'>
                        <Post data = {props.data.content.sharedpost} showoptions = {false}></Post>
                    </div>}
                    
                </div>
            </div>
            {props.showoptions && 
            <ul className="postuseroptions">
                <li>
                    <button className='postuseroption'>
                        <span>0</span>
                        <i className="fa-solid fa-comment"></i>
                    </button>
                </li>
                <li>
                    <button className={userliked ? 'postuseroption postuseroptionmarked' : 'postuseroption'} onClick={() => {LikeDislikeButton(true)}}>
                        <span>{mylike}</span>
                        <i className="fa-regular fa-thumbs-up"></i>
                    </button>
                </li>
                <li>
                    <button className={userdisliked ? 'postuseroption postuseroptionmarked' : 'postuseroption'} onClick={() => {LikeDislikeButton(false)}}>
                        <span>{mydislike}</span>
                        <i className="fa-regular fa-thumbs-down"></i>
                    </button>
                </li>
                <li>
                    <button className = 'postuseroption' onClick={() => {ShareButton()}}>
                        <span>{myshares}</span>
                        <i className="fa-solid fa-share"></i>
                    </button>
                </li>
            </ul>
            }
        </div>
    )
}