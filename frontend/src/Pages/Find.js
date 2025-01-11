import './Home.css';
import Navbar from "../Components/Navbar";
import Content from '../Components/Content';
import PostCreator from '../Components/PostCreator';
export default function Find()
{
    return (
        <div className="home">
            <Navbar></Navbar>
            <div className="panels">

                <div className="contentpanel">
                    <PostCreator></PostCreator>
                </div>
            </div>
        </div>
    );

}