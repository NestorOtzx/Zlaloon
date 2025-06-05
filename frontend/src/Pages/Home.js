import './Home.css';
import Navbar from "../Components/Navbar";
import Content from '../Components/Content';
import PostCreator from '../Components/PostCreator';

export default function Home()
{
    return(
        <div className="home">
            <Navbar center = {<ul>
                        <li><button className = "navbar_foryou">For you</button></li>
                        <li><button className = "navbar_followed">Followed</button></li>
                    </ul>}></Navbar>
            <div className="panels">
                <div className = "leftpanel">
                    <div className = "leftcontent">
                    </div>
                </div>
                <div className="contentpanel">
                    <PostCreator></PostCreator>
                    <Content></Content>
                </div>
                <div className="rightpanel">
                    <div className = "rightcontent">
                    </div>
                </div>
            </div>
        </div>
    );
}