import './Followers.css';
import Navbar from "../Components/Navbar";
import ContentPage from '../Components/ContentPage';
import {useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Followers()
{
    const { username } = useParams();
    
    const userparams = {
        params: {
            username: username,
            firstloadlimit: 10,
            loadmorelimit: 10,
        },}
    return(
        <div>
            <Navbar center = {<Link className='centercontent' to={"/"+username}>
                                <span>{username}</span>
                            </Link>}>
            </Navbar>
            <div className="panels">
                
                <div className="contentpanel">
                    <div className='contenttitle'>
                        <span>Followers</span>
                    </div>
                    <ContentPage query = "http://localhost:5000/getfollowers" params = {userparams} contentType = "user"></ContentPage>
                </div>
            </div>
        </div>
    );
}