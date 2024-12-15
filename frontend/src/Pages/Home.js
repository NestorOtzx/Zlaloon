import './Home.css';
import Navbar from "../Components/Navbar";
import Leftpanel from "../Components/Leftpanel";
import Rightpanel from "../Components/Rightpanel";
import Contentpanel from "../Components/Contentpanel";


export default function Home()
{
    return(
        <div className="home">
            <Navbar></Navbar>
            <div className="panels">
                <Leftpanel></Leftpanel>
                <Contentpanel></Contentpanel>
                <Rightpanel></Rightpanel>
            </div>
        </div>
    );
}