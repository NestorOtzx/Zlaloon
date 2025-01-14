import '../Components/Post'
import '../Components/UserBlock'
import Post from '../Components/Post';
import UserBlock from '../Components/UserBlock';

export default function Content(props)
{
    const content = [];

    if (props.content)
    {
        for(let i = 0; i<props.content.length; i++)
        {
            if (props.contentType === "post")
            {
                content.push(<Post key = {i} data = {props.content[i]}></Post>);
            }else if (props.contentType === "user"){
                content.push(<UserBlock key = {i} data = {props.content[i]}></UserBlock>);
            }
        }
    }
    

    return (
        <div className="content">
            {
                content
            }
        </div>
    );
}