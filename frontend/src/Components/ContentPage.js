import Content from '../Components/Content';
import './ContentPage.css';
import axios from 'axios';
import React, { useState, useEffect, useRef} from 'react';

export default function ContentPage(props)
{
    const [content, setContent] = useState([]); // Estado para almacenar los datos
    const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
    const [newContent, setNewContent] = useState(true);
    const [errors, setErrors] = useState(null); // Estado para manejar errores
    const [lastID, setLast] = useState('');
    const loadPostsRef = useRef();
    
    const getContent = async () => {
        if (!newContent) {return; }
        setLoading(true);
        try {
            const newParams = props.params;
            newParams.params.limit = props.params.params.firstloadlimit;

            if (lastID != '')
            {
                newParams.params.cursor = lastID;
                newParams.params.limit = props.params.params.loadmorelimit;
            }

            const ans = await axios.get(props.query, newParams);
            
            setContent((prev) => [...prev, ...(ans.data)]);
            if (ans.data.length > 0)
            {
                console.log("Posts getted");
                setLast(ans.data[ans.data.length-1]._id);
            }else{
                console.log("POSTS OVER");
                setNewContent(false);
            }
        } catch (error) {
            if (error.response) {
                console.error("Client error:", error.response.data);
                setErrors(error.response.data);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                alert("Error: No hubo respuesta del servidor.");
            } else {
                console.error("Error making post:", error.message);
                alert("Error: " + error.message);
            }
            //setErrors(error.message); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            
            (entries) => {
            console.log("Observe: ", loading, entries[0].isIntersecting );
            if (entries[0].isIntersecting && !loading) {
                console.log("Get posts call: ", loading);
                getContent();
            }
            },
            { threshold: 0.5 }
        
        );
        
        if (loadPostsRef.current) observer.observe(loadPostsRef.current);
    
        return () => {
            if (loadPostsRef.current) observer.unobserve(loadPostsRef.current);
        };
    }, [loading]);

    useEffect(() => {
        getContent();
    }, []);
    

    return (
    <div>
        {errors && errors.username && 
            <div>
                <span>{errors.username}</span>
            </div>    
        }{!errors &&
            <Content content = {content} contentType = {props.contentType}></Content>
        }
        {!errors && newContent && (!props.manualLoad || loading)&&
        
            <div ref={loadPostsRef} className="loadingblock">
                <i className="fa-solid fa-spinner loadingicon"></i>
            </div>
        }
        {!errors && newContent && (props.manualLoad && !loading)&&
            <button className="loadingblock" onClick={getContent}>
                <span className = "morecontentbutton">More...</span>
            </button>
        }
        {!errors && !newContent &&
            <div className="loadingblock">
                <i className="fa-solid fa-circle nomoreposts"></i>
                <i className="fa-solid fa-circle nomoreposts"></i>
                <i className="fa-solid fa-circle nomoreposts"></i>
            </div>
        } 
        
    </div>
    );
}