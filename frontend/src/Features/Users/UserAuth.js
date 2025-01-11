
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../Features/Users/UsersSlice';
import {useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function UserAuth(props)
{
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.userdata.username);
    const navigate = useNavigate(); // Hook para navegar

    useEffect(()=>{
        console.log("Pagina cargada!!", userdata);
        
        const verifySession = async () => {
            try{
                const response = await axios.get("http://localhost:5000/home", { withCredentials: true });
                console.log("Sesion actual: ", response.data);
                dispatch(login(response.data));
            }catch (error)
            {
                if (error.response) {
                    console.log("No está logeado:", error.response.data);
                } else if (error.request) {
                    console.error("No hubo respuesta del servidor:", error.request);
                } else {
                    console.error("Error al configurar la solicitud:", error.message);
                }
            }
        }
        verifySession();
    },[navigate])

    return (
        <>{props.children}</>
    );
}