
import React, {useState, useEffect, useRef} from "react";
import { useDispatch, useSelector } from 'react-redux'; 
import {Link} from "react-router-dom";
import Roundmenu from "./Roundmenu";
import Togglebutton from "./Togglebutton";
import LogoutButton from "./LogoutButton";
import './Navbar.css';


export default function Navbar(props)
{
    const panelsRef = useRef(null);
    const buttonsRef = useRef(null); 

    const [b_profile, setProfile] = useState(false);
    const [b_settings, setSettings] = useState(false);
    const [b_messages, setMessages] = useState(false);
    const [b_notifications, setNotifications] = useState(false);

    const userdata = useSelector((state) => state.userdata);

    const setPanels = (val) =>{
        setProfile(val); setSettings(val); setMessages(val); setNotifications(val);
    }

    const setPanel = (val, setPanelFunc) =>{
        setPanels(false);
        setPanelFunc(val);        
    }

    useEffect(() => {
        
        const handleClickOutside = (event) => {
            console.log("user data xd : ", userdata);
            console.log("buttons ref: ", buttonsRef.current);
            console.log("panels:", panelsRef.current);
            if (panelsRef.current && !panelsRef.current.contains(event.target) && !buttonsRef.current.contains(event.target)){
                setPanels(false);
                console.log("turn off panel");
            }
        }
    
        console.log("panels:", panelsRef.current);
        console.log("agregad0");
        document.addEventListener("mouseup", handleClickOutside);
        return () => {
            console.log("borrado");
            document.removeEventListener("mouseup", handleClickOutside);
        }
    },[]);

    return(
        <div className= "navbar">
            <nav>
                <div className = "left">
                    <Link to = "/" className="home_button"><i className="fa-solid fa-z"></i></Link>
                    <form>
                        <input placeholder='Search'></input>
                        <button><i className="fa-solid fa-magnifying-glass"></i></button>
                    </form>
                </div>
                <div className = "center">
                    {props.center}
                </div>
                <div  className = "right">
                    <ul ref = {buttonsRef}>
                        <li><Togglebutton onClick={() => setPanel(!b_notifications, setNotifications)}><i className="fas fa-bell"></i></Togglebutton></li>
                        <li><Togglebutton onClick={() => setPanel(!b_messages, setMessages)}><i className="fa-solid fa-message"></i></Togglebutton></li>
                        <li><Togglebutton onClick={() => setPanel(!b_settings, setSettings)}><i className="fa-solid fa-gear"></i></Togglebutton></li>
                        <li><Togglebutton onClick={() => setPanel(!b_profile, setProfile)}><i className="fa-solid fa-user"></i></Togglebutton></li>
                    </ul>
                </div>
            </nav>

            {b_profile && (
            <Roundmenu ref = {panelsRef} style={{width: "300px", float: "right", color: "black"}} className = "rightmenus">
                <span className="menu_title">Perfil</span>
                {
                    userdata.loggedin == true ?
                    <div>
                        <Link to = {"/"+userdata.username} className="panel_roundbutton">View profile</Link>
                        <span className="menu_subtitle">{userdata.username}</span>
                        <LogoutButton className="panel_roundbutton">Log out</LogoutButton>
                    </div>
                    :
                    <div>
                        <span className="profile_text">You are not logged in</span>
                        <Link to = "/signup" className="panel_roundbutton">Sign in</Link>
                        <span className="profile_text">Already have an account?</span>
                        <Link to = "/login" className="panel_roundbutton">Log in</Link>
                    </div>
                }
                
            </Roundmenu>
            )}
            {b_settings && (
            <Roundmenu ref = {panelsRef} style={{width: "400px", float: "right"}} className = "rightmenus">
                <span className="menu_title">Settings</span>
                <label>Dark mode</label>
                <input type="checkbox"></input>
            </Roundmenu>
            )}
            {b_messages && (
            <Roundmenu ref = {panelsRef} style={{width: "500px", float: "right"}} className = "rightmenus">
                <span className="menu_title">Messages</span>
            </Roundmenu>
            )}
            {b_notifications && (
            <Roundmenu ref = {panelsRef} style={{width: "350px", float: "right"}} className = "rightmenus">
                <span className="menu_title">Notifications</span>
            </Roundmenu>
            )}
        </div>
    )
}