
import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import Roundmenu from "./Roundmenu";
import Togglebutton from "./Togglebutton";
import './Navbar.css';


export default function Navbar()
{
    const panelsRef = useRef(null);
    const buttonsRef = useRef(null); 

    const [b_profile, setProfile] = useState(false);
    const [b_settings, setSettings] = useState(false);
    const [b_messages, setMessages] = useState(false);
    const [b_notifications, setNotifications] = useState(false);

    const setPanels = (val) =>{
        setProfile(val); setSettings(val); setMessages(val); setNotifications(val);
    }

    const setPanel = (val, setPanelFunc) =>{
        setPanels(false);
        setPanelFunc(val);        
    }

    useEffect(() => {

        const handleClickOutside = (event) => {
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
                    <i className="fa-solid fa-z"></i>
                    <form>
                        <input placeholder='Buscar'></input>
                        <button><i className="fa-solid fa-magnifying-glass"></i></button>
                    </form>
                </div>
                <div className = "center">
                    <ul>
                        <li><span className = "type_content_button">Para ti</span></li>
                        <li><span className = "type_content_button">Seguidos</span></li>
                    </ul>
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
            <Roundmenu ref = {panelsRef} style={{width: "300px", float: "right", color: "black", "background-color": "white"}}>
                <h2>Perfil</h2>
                <span className="profile_text">No estás logeado</span>
                <Link to = "/signup" className="panel_roundbutton">Registrarse</Link>
                <span className="profile_text">¿Ya tienes una cuenta?</span>
                <Link to = "/login" className="panel_roundbutton">Iniciar sesión</Link>
            </Roundmenu>
            )}
            {b_settings && (
            <Roundmenu ref = {panelsRef} style={{width: "400px", float: "right"}} className = "rightmenus">
                <h2>Configuración</h2>
                <label>Modo oscuro</label>
                <input type="checkbox"></input>
            </Roundmenu>
            )}
            {b_messages && (
            <Roundmenu ref = {panelsRef} style={{width: "500px", float: "right"}} className = "rightmenus">
                <h2>Mensajes</h2>
            </Roundmenu>
            )}
            {b_notifications && (
            <Roundmenu ref = {panelsRef} style={{width: "350px", float: "right"}} className = "rightmenus">
                <h2>Notificaciones</h2>
            </Roundmenu>
            )}
        </div>
    )
}