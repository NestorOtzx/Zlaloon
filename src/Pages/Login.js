import Roundmenu from "../Components/Roundmenu";
import {Outlet, Link} from "react-router-dom";
import './Authentication.css';  

export default function Login(){
    return(
        <div className="auth">
            <Roundmenu className = "auth_menu">
                <Link className="close_auth" to ="/"><i class="fas fa-times"></i></Link>
                <div className = "auth_content">
                    <span className = "auth_label">Iniciar sesión</span> 
                    <div className = "auth_deco_line1"></div>    
                    <form>
                        
                        <ul>
                        <li><input placeholder="Email"></input></li>
                        <li><input placeholder="Contraseña"></input></li>
                        </ul>
                        <div className = "auth_deco_line2"></div>
                        <button>Ingresar</button>                        
                    </form>
                    
                    
                </div>
            </Roundmenu>
            <Outlet></Outlet>
        </div>
    );
}