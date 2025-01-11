import './Home.css';
import Navbar from "../Components/Navbar";
import Leftpanel from "../Components/Leftpanel";
import Rightpanel from "../Components/Rightpanel";
import Content from '../Components/Content';
import PostCreator from '../Components/PostCreator';

export default function Home()
{
    return(
        <div className="home">
            <Navbar center = {<ul>
                        <li><button className = "centercontent_button">For you</button></li>
                        <li><button className = "centercontent_button">Followed</button></li>
                    </ul>}></Navbar>
            <div className="panels">
                <Leftpanel></Leftpanel>
                <div className="contentpanel">
                    <PostCreator></PostCreator>
                    <Content></Content>
                </div>
                <Rightpanel></Rightpanel>
            </div>
        </div>
    );
}