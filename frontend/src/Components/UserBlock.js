import './UserBlock.css';
import {Link} from "react-router-dom";
import FollowButton from './FollowButton';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export default function UserBlock(props)
{
    const navigate = useNavigate();
    const userdata = useSelector((state) => state.userdata);

    const goToProfile = () =>
    {
        navigate("/"+props.data.username);
    }

    return (
        <div onClick={goToProfile} className='userblockclickable'>
            <div className="userblockcontainer">
                <div className="userinfo">
                    <div className='userprofilepicture'>
                        <img src = {process.env.PUBLIC_URL+"/images/nopp.png"}></img>
                        
                    </div>
                    <span>{props.data.username}</span>

                </div>
                { userdata.loggedin && props.data && userdata.username !== props.data.username &&
                    <div onClick={(event) => event.stopPropagation()}>
                        <FollowButton className='followbutton' userid={userdata.userid} profileinfo = {props.data}></FollowButton>
                    </div>
                }
            </div>
        </div>
    )
}