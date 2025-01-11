import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../Features/Users/UsersSlice';
import { useNavigate } from "react-router-dom";

export default function LogoutButton(props)
{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout_handler = async () =>{
        console.log("Deslogeando");
        try{
            const response = await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
            console.log("respuesta a deslogeo: ", response.message);
            dispatch(logout());
            navigate('/login');
        }catch (error)
        {
            console.log("No se pudo deslogear");
            if (error.response) {
                console.error("Error del cliente:", error.response.data);
            } else if (error.request) {
                console.error("No hubo respuesta del servidor:", error.request);
            } else {
                console.error("Error al configurar la solicitud:", error.message);
            }
        }
    }

    return(
        <button className={props.className} onClick={logout_handler}>
            {props.children}
        </button>
    )

}