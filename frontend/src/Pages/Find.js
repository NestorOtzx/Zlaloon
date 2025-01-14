import './Find.css';
import Navbar from "../Components/Navbar";
import ContentPage from '../Components/ContentPage';
import { useSearchParams } from "react-router-dom";
import { useState } from "react";


export default function Find()
{
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [findType, setFindType] = useState(1);

    const handleSelect = (name) =>
    {
        setFindType(name);
    }

    const userparams = {
        params: {
            likename: query,
            firstloadlimit: 5,
            loadmorelimit: 10,
        },}
    
    const postparams = {
        params: {
            pattern: query,
            firstloadlimit: 10,
            loadmorelimit: 10,
        },}

    return (
        <div>
            <Navbar center={
                <ul className='findcentercontainer'>
                    <li><button className={findType === 1? 'centercontent_button_selected' : 'centercontent_button'} onClick={ () => {handleSelect(1)}}>Recommended</button></li>
                    <li><button className={findType === 2? 'centercontent_button_selected' : 'centercontent_button'} onClick={ () => {handleSelect(2)}}>People</button></li>
                    <li><button className={findType === 3? 'centercontent_button_selected' : 'centercontent_button'} onClick={ () => {handleSelect(3)}}>Posts</button></li>
                </ul>
            }></Navbar>
            <div className="panels">
                <div className="contentpanel">
                    {findType === 1 && <div>
                        <div className='contenttitle'>
                            <span>People</span>
                        </div>
                        <ContentPage query = "http://localhost:5000/getprofileslike" params = {userparams} contentType = "user" manualLoad = {true}></ContentPage>
                        <div className='contenttitle'>
                            <span>Posts</span>
                        </div>
                        <ContentPage query = "http://localhost:5000/getpostslike" params = {postparams} contentType = "post"></ContentPage>
                    </div>}
                    {findType === 2 && <div>
                        <div className='contenttitle'>
                            <span>People</span>
                        </div>
                        <ContentPage query = "http://localhost:5000/getprofileslike" params = {userparams} contentType = "user"></ContentPage>
                    </div>}
                    {findType === 3 && <div>
                        <div className='contenttitle'>
                            <span>Posts</span>
                        </div>
                        <ContentPage query = "http://localhost:5000/getpostslike" params = {postparams} contentType = "post"></ContentPage>
                    </div>}

                </div>
            </div>
        </div>
    );

}