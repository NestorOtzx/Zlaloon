import './Togglebutton.css'

export default function Togglebutton(props)
{
    return(
        <button ref = {props.ref} style = {props.style} onClick={props.onClick} className='button'>
            {props.children}
        </button>
    )
}