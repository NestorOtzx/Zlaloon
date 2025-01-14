import './FollowButton.css';
import axios from 'axios';
import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

export default function FollowButton(props)
{
    const [errors, setErrors] = useState(null); 
    const [alreadyFollowed, setAlreadyFollowed] = useState(false);
    const navigate = useNavigate();

    const getFollowed = () => {
        console.log("Get followed call", props.profileinfo, "userid: ", props.userid);
        if (!props.userid || !props.profileinfo.followers) { return false; }
        let ans = false;
        for (let i = 0; i<props.profileinfo.followers.length; i++)
        {
            console.log("Getting followed, comparing ", props.userid, " followers", props.profileinfo.followers[i]);
            if (props.userid == props.profileinfo.followers[i])
            {
                ans = true;
                break;
            }
        }
        return ans;

    };

    useEffect(()=>{
        setAlreadyFollowed(getFollowed());
        console.log("already followed: ", alreadyFollowed);
    }, []);
    


    const FollowButton = async (follow)=>
    {
        console.log("FOLLOW/UNFOLLOW CLICKED!!");
        const data = {userid: props.userid, profileid: props.profileinfo._id};
        console.log("Follow data: ", data);
        try {
            let response;
            if (follow)
            {
                response = await axios.post("http://localhost:5000/followprofile", data, { withCredentials: true });
            }else{
                response = await axios.post("http://localhost:5000/unfollowprofile", data, { withCredentials: true });
            }
            console.log("Exito! mensaje de respuesta: ", response.data.message);
        } catch (error) {
            if (error.response) {
                console.error("Client error:", error.response.data);
                setErrors(error.response.data);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                alert("Error: No hubo respuesta del servidor.");
            } else {
                console.error("Error making post:", error.message);
                alert("Error: " + error.message);
            }
            //setErrors(error.message); 
        } finally {
            console.log("Successfully");
            window.location.reload();
        }
    }

    return (
        <button className={props.className} onClick={ () => {FollowButton(!alreadyFollowed)}}>
        { alreadyFollowed && <span>Unfollow</span>
        }
        { !alreadyFollowed && <span>Follow</span>
        }
        </button>
    );
}