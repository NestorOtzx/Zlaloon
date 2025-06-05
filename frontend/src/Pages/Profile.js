import './Profile.css';
import './Home.css';
import Navbar from "../Components/Navbar";
import ContentPage from '../Components/ContentPage';
import axios from 'axios';
import React, { useState, useEffect, useRef} from 'react';
import FollowButton from '../Components/FollowButton';
import {Link, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Profile()
{
    const { username } = useParams();

    const [userinfo, setUserInfo] = useState(null); // Estado para almacenar los datos
    const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
    const [errors, setErrors] = useState(null); // Estado para manejar errores

    const userdata = useSelector((state) => state.userdata);

    const params = {
        params: {
            username: username,
            firstloadlimit: 10,
            loadmorelimit: 10,
        },}

    const userparams = {
        params: {
            username: username,
        },}

    const getProfile = async () => {
        setLoading(true);
        try {
            const ans = await axios.get("http://localhost:5000/getprofilebyusername", userparams);   
            setUserInfo(ans.data);
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
            setLoading(false); 
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="profile">
            <Navbar center = {
                <Link className='centercontent' to={"/"+username}>
                    <span>{username}</span>
                </Link>
                }>
            </Navbar>
            <div className="panels">
                <div className="contentpanel">
                    <div className = "profilecontainer">
                        <div className='profilepicture'>
                            <img src = "images/nopp.png" ></img>
                        </div>
                        { !loading &&
                        <div className='profilestats'>
                            <div className='statcontainer'>
                                <Link to={"/"+username+"/followers"}>
                                    <span>Followers</span>
                                </Link>
                                <span>{userinfo && userinfo.followers? userinfo.followers.length: 0}</span>
                            </div>
                            <div className='statcontainer'>
                                <Link to = {"/"+username+"/following"}>
                                    <span>Following</span>
                                </Link>
                                    <span>{userinfo && userinfo.following? userinfo.following.length: 0}</span>
                            </div>
                        </div>
                        }
                        { userdata.loggedin && userinfo && userdata.username !== userinfo.username &&
                            <div className='profileoptions'>
                                <FollowButton className='profileoption' userid={userdata.userid} profileinfo = {userinfo}></FollowButton>
                                <button className='profileoption'>Send message</button>
                            </div>
                        }
                        

                        {(!userdata || !userdata.loggedin ) &&
                            <div className='profileoptions'>
                                <div>
                                    <span>You need to</span> <Link to="/login">log in</Link> <span>to interact with people.</span>
                                </div>
                            </div>
                        }
                        
                    </div>
                    <ContentPage query = "http://localhost:5000/getprofileposts" params = {params} contentType = "post" ></ContentPage>
                    

                    
                </div>
                
            </div>
        </div>
    );
}