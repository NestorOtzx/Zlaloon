import '../Components/Post'
import Post from '../Components/Post';

export default function Content(props)
{
    const posts = [];

    if (props.posts)
    {
        for(let i = 0; i<props.posts.length; i++)
        {
            posts.push(<Post key = {i} data = {props.posts[i]}></Post>);
        }
    }
    

    return (
        <div className="content">
            {
                posts
            }
        </div>
    );
}