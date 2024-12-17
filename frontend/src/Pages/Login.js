import Roundmenu from "../Components/Roundmenu";
import {Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Authentication.css';  
import { useState } from "react";

export default function Login(){
    const [userdata, setUserData] = useState({username: "", password:""});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target; /*Get selected */
        setUserData({ ...userdata, [name]: value });
        setErrors({});
    };

    const handleLogin = async (e) =>{
        e.preventDefault();
        const data = {username: userdata.username, password: userdata.password};
        console.log("VOY A ENVIARRR AAA", data);
        try{
            const response = await axios.post("http://localhost:5000/login", data, { withCredentials: true });
            console.log("Exito! mensaje de respuesta: ", response.data.message);
            navigate('/');
        }catch (error){
            if (error.response) {
                console.error("Error del cliente:", error.response.data);
                setErrors(error.response.data);
            } else if (error.request) {
                console.error("No hubo respuesta del servidor:", error.request);
                alert("Error: No hubo respuesta del servidor.");
            } else {
                console.error("Error al configurar la solicitud:", error.message);
                alert("Error: " + error.message);
            }
        }
    }   

    return(
        <div className="auth">
            <Roundmenu className = "auth_menu">
                <Link className="close_auth" to ="/"><i className="fas fa-times"></i></Link>
                <div className = "auth_content">
                    <span className = "auth_label">Iniciar sesión</span> 
                    <div className = "auth_deco_line1"></div>    
                    <form onSubmit={handleLogin}>
                        <ul>
                        <li><input name="username" placeholder="Usuario o correo electrónico" value = {userdata.username} onChange={handleChange} className={errors.username ? "errorinput":"noerrorinput"}></input></li>
                        <li><input type ="password" name="password" placeholder="Contraseña" value = {userdata.password} onChange={handleChange} className={errors.username ? "errorinput":"noerrorinput"}></input>
                        {(errors.username) && <p>{errors.username}</p>}
                        </li>
                        </ul>

                        <div className = "auth_deco_line2"></div>
                        <button type="submit">Ingresar</button>                        
                    </form> 
                </div>
            </Roundmenu>
            <Outlet></Outlet>
        </div>
    );
}