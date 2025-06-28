import './PostCreator.css';
import './Post.css';
import {useSelector} from 'react-redux';
import {Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";

export default function PostCreator()
{
    const userdata = useSelector((state) => state.userdata);
    const [postdata, setUserData] = useState({content: ""});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target; /*Get selected */
        setUserData({ ...postdata, [name]: value });
        setErrors({ ...errors, [name]: "" }); /*Clear errors of selected on change*/
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userdata.username) {
          newErrors.username = "Your username is not valid, this should not happen. Report it to the developer.";
        }

        if (postdata.content.length > 256) {
          newErrors.content = "Your message is too long!";
        }

        if (postdata.content.length < 1) {
            newErrors.content = "Your message is too short!";
        }

    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

    const handleSubmit = async (e) =>{
        console.log("handle submit");
        e.preventDefault();
        console.log("Not default");
        const data = {username: userdata.username, content: postdata.content};
        if (validateForm())
        {
            console.log("form validated");
            try{
                console.log("pre post, data: ", data);
                const response = await axios.post("http://localhost:5000/makepost", data, { withCredentials: true });
                //const response = await axios.post("http://localhost:5000/makepost", data);
                console.log("Message was sent! answer: ", response.data.message);
                window.location.reload(false);
                
            }catch (error){
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
            }
        }else{
            console.log(errors);
        }
    }   

    return (
        <div className="postcreatorcontainer">
            {userdata.loggedin && 
            <div>
                <div className = "postinfo">
                    <div className = "postuserinfo">
                        <img className = "postprofilepicture" src = "https://placehold.co/400x400"></img>            
                        <span className = "postusername">{userdata.username}</span>
                    </div>
                </div>
                <form className = "postcreatorcontent" onSubmit={handleSubmit}>
                    <textarea name = "content" value = {postdata.content} placeholder="Write something..." onChange={handleChange}></textarea>
                    <div className="postcreatorbuttons"> 
                        <button type="submit">Post</button>
                    </div>
                    
                </form>
            </div>
            }
            { !userdata.loggedin && 
            <div className="postnouser">
                <span>You are not logged in. </span>
                <Link to = "/login" className="postnouserbutton">Log In</Link>
            </div>    
            }
            

        </div>
    );
}