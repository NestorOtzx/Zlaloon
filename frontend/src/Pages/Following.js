import './Following.css';
import Navbar from "../Components/Navbar";
import {useParams} from 'react-router-dom';
import ContentPage from '../Components/ContentPage';
import { Link } from 'react-router-dom';
export default function Following()
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
                        <span>Following</span>
                    </div>
                    <ContentPage query = "http://localhost:5000/getfollowing" params = {userparams} contentType = "user"></ContentPage>
                </div>
            </div>
        </div>
    );
}