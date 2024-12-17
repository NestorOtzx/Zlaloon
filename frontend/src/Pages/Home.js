import './Home.css';
import Navbar from "../Components/Navbar";
import Leftpanel from "../Components/Leftpanel";
import Rightpanel from "../Components/Rightpanel";
import Contentpanel from "../Components/Contentpanel";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home()
{
    const [userdata, setUserData] = useState({});

    useEffect(()=>{
        console.log("Pagina cargada!!");
        const verifySession = async () => {
            try{
                const response = await axios.get("http://localhost:5000/home", { withCredentials: true });
                console.log("Sesion actual: ", response.data);
                setUserData(response.data);
            }catch (error)
            {
                if (error.response) {
                    console.error("Error del cliente:", error.response.data);
                } else if (error.request) {
                    console.error("No hubo respuesta del servidor:", error.request);
                } else {
                    console.error("Error al configurar la solicitud:", error.message);
                }
            }
        }
        verifySession();
    },[])

    return(
        <div className="home">
            <Navbar></Navbar>
            <div className="panels">
                <Leftpanel></Leftpanel>
                <Contentpanel></Contentpanel>
                <Rightpanel></Rightpanel>
            </div>
        </div>
    );
}