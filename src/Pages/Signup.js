import Roundmenu from "../Components/Roundmenu";
import {Outlet, Link} from "react-router-dom";
import './Authentication.css';  

export default function Signup(){
    return(
        <div className="auth">
            <Roundmenu className = "auth_menu">
                <Link className="close_auth" to ="/"><i class="fas fa-times"></i></Link>
                <div className = "auth_content">
                    <span className = "auth_label">Registrarse</span> 
                    <div className = "auth_deco_line1"></div>    
                    <form>
                        
                        <ul>
                        <li><input placeholder="Nombre de usuario"></input></li>
                        <li><input placeholder="Email"></input></li>
                        <li><input placeholder="Contraseña"></input></li>
                        <li><input placeholder="Repetir contraseña"></input></li>
                        </ul>
                        <div className = "auth_deco_line2"></div>
                        <button>Registrarse</button>                        
                    </form>
                    
                    
                </div>
            </Roundmenu>
            <Outlet></Outlet>
        </div>
    );
}