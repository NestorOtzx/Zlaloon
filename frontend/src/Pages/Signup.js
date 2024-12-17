import Roundmenu from "../Components/Roundmenu";
import {Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Authentication.css';  
import { useState } from "react";

export default function Signup(){
    const [userdata, setUserData] = useState({username: "", email:"", password:"", rpassword:""});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target; /*Get selected */
        setUserData({ ...userdata, [name]: value });
        setErrors({ ...errors, [name]: "" }); /*Clear errors of selected*/
    };

    const validateForm = () => {
        const newErrors = {};
        // Validación del email
        if (!userdata.email.includes("@")) {
          newErrors.email = "El email debe ser válido.";
        }
        // Validación de la contraseña
        if (userdata.password.length < 8) {
          newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        }
    
        // Validación de contraseñas coincidentes
        if (userdata.password !== userdata.rpassword) {
          newErrors.rpassword = "Las contraseñas no coinciden.";
        }
    
        setErrors(newErrors);
        //setErrors({}); //just for testing without checking
    
        // Retornar si no hay errores
        return Object.keys(newErrors).length === 0;
        //return true;
      };

    const handleRegister = async (e) =>{
        e.preventDefault();
        const data = {username: userdata.username, email: userdata.email, password: userdata.password};
        console.log("VOY A ENVIARRR AAA", data);
        if (validateForm())
        {
            try{
                const response = await axios.post("http://localhost:5000/signup", data, { withCredentials: true });
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
    }   

    return(
        <div className="auth">
            <Roundmenu className = "auth_menu">
                <Link className="close_auth" to ="/"><i className="fas fa-times"></i></Link>
                <div className = "auth_content">
                    <span className = "auth_label">Registrarse</span> 
                    <div className = "auth_deco_line1"></div>    
                    <form autoComplete="off" onSubmit={handleRegister}>
                        <ul>
                        <li><input name="username" placeholder="Nombre de usuario" value = {userdata.username} onChange={handleChange} className={errors.username ? "errorinput":"noerrorinput"}></input>
                        {errors.username && <p>{errors.username}</p>}
                        </li>
                        <li><input name="email" placeholder="Email" value = {userdata.email} onChange={handleChange} className={errors.email ? "errorinput":"noerrorinput"}></input>
                        {errors.email && <p>{errors.email}</p>}
                        </li>
                        <li><input type ="password" name="password" placeholder="Contraseña" value = {userdata.password} onChange={handleChange} className={errors.password ? "errorinput":"noerrorinput"}></input>
                        {errors.password && <p>{errors.password}</p>}
                        </li>
                        <li><input type ="password" name="rpassword" placeholder="Repetir contraseña" value = {userdata.rpassword} onChange={handleChange} className={errors.rpassword ? "errorinput":"noerrorinput"}></input>
                        {errors.rpassword && <p>{errors.rpassword}</p>}
                        </li>
                        </ul>

                        <div className = "auth_deco_line2"></div>
                        <button type="submit">Registrarse</button>                        
                    </form> 
                </div>
            </Roundmenu>
            <Outlet></Outlet>
        </div>
    );
}