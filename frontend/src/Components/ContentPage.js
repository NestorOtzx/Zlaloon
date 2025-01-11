import Content from '../Components/Content';
import './ContentPage.css';
import axios from 'axios';
import React, { useState, useEffect, useRef} from 'react';

export default function ContentPage(props)
{
    const [posts, setPosts] = useState([]); // Estado para almacenar los datos
    const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
    const [newPosts, setNewPosts] = useState(true);
    const [errors, setErrors] = useState(null); // Estado para manejar errores
    const [lastPostID, setLastPost] = useState('');
    const loadPostsRef = useRef();
    
    const getPosts = async () => {
        if (!newPosts) {return; }
        setLoading(true);
        try {
            console.log("Try get posts");
            if (lastPostID != '')
            {
                props.params.params.cursor = lastPostID;
            }
            const ans = await axios.get(props.query, props.params);
            
            setPosts((prev) => [...prev, ...(ans.data)]);
            if (ans.data.length > 0)
            {
                console.log("Posts getted");
                setLastPost(ans.data[ans.data.length-1]._id);
            }else{
                console.log("POSTS OVER");
                setNewPosts(false);
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
                getPosts();
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
        getPosts();
    }, []);
    

    return (
    <div>
        {errors && errors.username && 
            <div>
                <span>The account {props.params.params.username} does not exists</span>
            </div>    
        }{!errors &&
            <Content posts = {posts}></Content>
            
        }
        {
            /*
            <div ref={loadPostsRef} className="loadingblock">
                <p>Loading more posts</p>
            </div>
            */
        }
        {!errors && newPosts &&
        
            <div ref={loadPostsRef} className="loadingblock">
                <i class="fa-solid fa-spinner loadingicon"></i>
            </div>
        }
        {!errors && !newPosts &&
            <div className="loadingblock">
                <i class="fa-solid fa-circle nomoreposts"></i>
                <i class="fa-solid fa-circle nomoreposts"></i>
                <i class="fa-solid fa-circle nomoreposts"></i>
            </div>
        } 
        
    </div>
    );
}