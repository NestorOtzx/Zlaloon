
import React, {useState, useEffect, useRef} from "react";
import { useDispatch, useSelector } from 'react-redux'; 
import {Link, useNavigate} from "react-router-dom";
import Roundmenu from "./Roundmenu";
import Togglebutton from "./Togglebutton";
import LogoutButton from "./LogoutButton";
import './Navbar.css';


export default function Navbar(props)
{
    const navigate = useNavigate();
    const [find, setFind] = useState(''); 
    const panelsRef = useRef(null);
    const buttonsRef = useRef(null); 
    const searchInputRef = useRef(null);

    //search button stuff
    const [search, setSearch] = useState(false);
    const handleSearchClick = () => {
        setSearch(true)
        setTimeout(() => {
        searchInputRef.current?.focus(); // Enfoca el segundo input
        }, 0); // Espera al siguiente render
    };

    const handleSearchBlur = () => {
        setSearch(false); // Cuando se pierde foco en el segundo, reaparece el primero
    };

    const [b_profile, setProfile] = useState(false);
    const [b_settings, setSettings] = useState(false);
    const [b_messages, setMessages] = useState(false);
    const [b_notifications, setNotifications] = useState(false);
    const [b_options, setOptions] = useState(false);

    const userdata = useSelector((state) => state.userdata);

    const handleFindChange = (event) => {
        setFind(event.target.value); // Actualizar el estado con el valor del input
    };

    const OnSubmitFind = (e) =>
    {
        e.preventDefault();
        navigate(`/find?query=${find}`);
        window.location.reload();
    }

    const setPanels = (val) =>{
        setProfile(val); setSettings(val); setMessages(val); setNotifications(val); setOptions(val);
    }

    const setPanel = (val, setPanelFunc) =>{
        setPanels(false);
        setPanelFunc(val);        
    }

    useEffect(() => {
        setSearch(false)
        const handleResize = () => {
            if (window.innerWidth > 750){
                setOptions(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        const handleClickOutside = (event) => {
            console.log("user data xd : ", userdata);
            console.log("buttons ref: ", buttonsRef.current);
            console.log("panels:", panelsRef.current);
            if (panelsRef.current && !panelsRef.current.contains(event.target) && buttonsRef.current && !buttonsRef.current.contains(event.target)){
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
            window.removeEventListener("resize", handleResize);
        }
    },[]);

    

    return(
        <div className= "navbar">
            <nav>
                <div className = "nav-left">
                    <Link to = "/" className="home_button"><i className="fa-solid fa-z"></i></Link>
                    { search ? 
                        <form className="search-form"onSubmit={OnSubmitFind}>
                            <input ref={searchInputRef} placeholder='Search' value = {find} onChange={handleFindChange} onBlur={handleSearchBlur}></input>
                            <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                        </form>
                        :
                        <div className="search-form-placeholder">
                            <input placeholder='Search' onClick={handleSearchClick}></input>
                            <button onClick={handleSearchClick}><i className="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                    }
                </div>
                <div className = "nav-center">
                    {props.center}
                </div>
                <div className = "nav-right">
                    <ul className="nav-right-menu-button" ref = {buttonsRef}>
                        <li><Togglebutton onClick={() => setPanel(!b_options, setOptions)}><i class="fa-solid fa-grip-lines"></i></Togglebutton></li>
                    </ul>
                    <ul className = "nav-right-menu" ref = {buttonsRef}>
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
            {b_options && (
            <Roundmenu ref = {panelsRef} style={{width: "75px", float: "right"}} className = "rightmenus">
                <ul className = "nav-right-menu-vertical">
                    <li><Togglebutton onClick={() => setPanel(!b_notifications, setNotifications)}><i className="fas fa-bell"></i></Togglebutton></li>
                    <li><Togglebutton onClick={() => setPanel(!b_messages, setMessages)}><i className="fa-solid fa-message"></i></Togglebutton></li>
                    <li><Togglebutton onClick={() => setPanel(!b_settings, setSettings)}><i className="fa-solid fa-gear"></i></Togglebutton></li>
                    <li><Togglebutton onClick={() => setPanel(!b_profile, setProfile)}><i className="fa-solid fa-user"></i></Togglebutton></li>
                </ul>
            </Roundmenu>
            )}
        </div>
    )
}