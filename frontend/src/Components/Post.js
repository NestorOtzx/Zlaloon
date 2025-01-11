import './Post.css';
import formatDateTime from '../Utilities/formatDateTime';

export default function Post(props)
{   
    return (
        <div className="postcontainer">
            <div className="postvalues">
                <div className = "postinfo">
                    <div className = "postuserinfo">
                        <img className = "postprofilepicture" src = "images/nopp.png"></img>            
                        <span className = "postusername">{props.data.username}</span>
                    </div>
                    <div className = "basicinfo">
                        <span>{formatDateTime(props.data.date)}</span>
                    </div>
                </div>
                <div className = "postcontent">
                    <span>{props.data.content}</span>
                </div>
            </div>
            <ul className="postuseroptions">
                <li>
                    <button className='postuseroption'>
                        <span>0</span>
                        <i className="fa-solid fa-comment"></i>
                    </button>
                </li>
                <li>
                    <button className='postuseroption'>
                        <span>0</span>
                        <i className="fa-regular fa-thumbs-up"></i>
                    </button>
                </li>
                <li>
                    <button className='postuseroption'>
                        <span>0</span>
                        <i className="fa-regular fa-thumbs-down"></i>
                    </button>
                </li>
                <li>
                    <button className='postuseroption'>
                        <span>0</span>
                        <i className="fa-solid fa-share"></i>
                    </button>
                </li>
            </ul>
            
        </div>
    )
}