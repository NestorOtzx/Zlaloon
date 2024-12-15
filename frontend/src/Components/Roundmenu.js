import './Roundmenu.css'

export default function Roundmenu(props){
    return (
    <div ref = {props.ref} style = {props.style} className= {`menubg ${props.className}`}>
        {props.children}
    </div>
    );
}